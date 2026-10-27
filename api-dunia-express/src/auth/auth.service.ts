import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import crypto from 'node:crypto';
import { AuditAction, type AuditActionType } from '../audit/audit.constants.js';
import { AuditService } from '../audit/audit.service.js';
import { PasswordService } from '../common/security/password/password.service.js';
import {
  sanitizeUser,
  type UserResponseDto,
} from '../users/dto/user-response.dto.js';
import { UsersRepository } from '../users/users.repository.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { SessionsService } from './sessions.service.js';
import type { JwtRefreshPayload } from './strategies/refresh-token.strategy/refresh-token.strategy.js';

export interface ClientMetadata {
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    private readonly sessionsService: SessionsService,
  ) {}

  /**
   * Helper to safely log audit events without failing critical authentication operations.
   */
  private async safeAuditLog(params: {
    userId?: string;
    action: AuditActionType;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.auditService.log(params);
    } catch (err) {
      this.logger.warn(
        `Audit logging failed for action ${params.action}:`,
        err,
      );
    }
  }

  /**
   * Helper to compute future expiration date from refresh token lifetime (default 7 days).
   */
  private calculateRefreshExpiry(): Date {
    const defaultDays = 7;
    return new Date(Date.now() + defaultDays * 24 * 60 * 60 * 1000);
  }

  /**
   * Generates a short-lived access token and a long-lived refresh token.
   */
  private async generateTokenPair(
    userId: string,
    email: string,
    sessionId: string,
    familyId: string,
  ): Promise<TokenPair> {
    const accessSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const issuer = this.configService.get<string>('JWT_ISSUER');
    const audience = this.configService.get<string>('JWT_AUDIENCE');

    const accessPayload = {
      sub: userId,
      email,
      jti: crypto.randomUUID(),
      token_type: 'access',
    };

    const refreshPayload = {
      sub: userId,
      sessionId,
      familyId,
      jti: crypto.randomUUID(),
      token_type: 'refresh',
    };

    const signOptions = {
      ...(issuer ? { issuer } : {}),
      ...(audience ? { audience } : {}),
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as any,
        ...signOptions,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as any,
        ...signOptions,
      }),
    ]);

    return { access_token, refresh_token };
  }

  /**
   * Register a new user account.
   */
  async register(
    dto: RegisterDto,
    metadata?: ClientMetadata,
  ): Promise<{ user: UserResponseDto }> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const existing = await this.userRepository.findByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    const user = await this.userRepository.create({
      fullName: dto.fullName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: dto.phone,
      avatar: dto.avatar,
      status: 'active',
    });

    await this.safeAuditLog({
      userId: user.id,
      action: AuditAction.REGISTER_SUCCESS,
      resource: 'auth',
      resourceId: user.id,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    });

    return { user: sanitizeUser(user) };
  }

  /**
   * Authenticate user credentials and start a new refresh session.
   */
  async login(
    dto: LoginDto,
    metadata?: ClientMetadata,
  ): Promise<{
    user: UserResponseDto;
    access_token: string;
    refresh_token: string;
  }> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || user.status !== 'active') {
      await this.safeAuditLog({
        action: AuditAction.LOGIN_FAILED,
        resource: 'auth',
        metadata: { email: dto.email, reason: 'user_not_found_or_inactive' },
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      await this.safeAuditLog({
        userId: user.id,
        action: AuditAction.LOGIN_FAILED,
        resource: 'auth',
        metadata: { email: dto.email, reason: 'invalid_password' },
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate new session & family identifiers
    const familyId = crypto.randomUUID();
    const tempSessionId = crypto.randomUUID();

    const { access_token, refresh_token } = await this.generateTokenPair(
      user.id,
      user.email,
      tempSessionId,
      familyId,
    );

    // Persist refresh session in PostgreSQL with SHA-256 hash
    const expiresAt = this.calculateRefreshExpiry();
    const session = await this.sessionsService.createSession(
      user.id,
      refresh_token,
      familyId,
      expiresAt,
      metadata,
    );

    await this.safeAuditLog({
      userId: user.id,
      action: AuditAction.LOGIN_SUCCESS,
      resource: 'auth',
      resourceId: session.id,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    });

    return {
      user: sanitizeUser(user),
      access_token,
      refresh_token,
    };
  }

  /**
   * Rotates a refresh token and generates a new access token.
   * Handles concurrency and token reuse detection.
   */
  async refresh(
    rawRefreshToken: string,
    metadata?: ClientMetadata,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    let payload: JwtRefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(
        rawRefreshToken,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (
      payload.token_type !== 'refresh' ||
      !payload.sub ||
      !payload.sessionId ||
      !payload.familyId
    ) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    // Verify user exists and is active
    const user = await this.userRepository.findById(payload.sub);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    // Validate active session
    let existingSession;
    try {
      existingSession = await this.sessionsService.validateSession(
        payload.sessionId,
        rawRefreshToken,
      );
    } catch (err: any) {
      await this.safeAuditLog({
        userId: user.id,
        action: AuditAction.SECURITY_ALERT_TOKEN_REUSE,
        resource: 'auth',
        metadata: { familyId: payload.familyId, error: err.message },
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      });
      throw err;
    }

    // Generate rotated token pair with the SAME familyId
    const newSessionId = crypto.randomUUID();
    const { access_token, refresh_token: newRefreshToken } =
      await this.generateTokenPair(
        user.id,
        user.email,
        newSessionId,
        payload.familyId,
      );

    const newExpiresAt = this.calculateRefreshExpiry();

    try {
      await this.sessionsService.rotateSession(
        existingSession.id,
        user.id,
        newRefreshToken,
        payload.familyId,
        newExpiresAt,
        metadata,
      );
    } catch (err: any) {
      await this.safeAuditLog({
        userId: user.id,
        action: AuditAction.SECURITY_ALERT_TOKEN_REUSE,
        resource: 'auth',
        metadata: { familyId: payload.familyId, error: err.message },
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      });
      throw err;
    }

    await this.safeAuditLog({
      userId: user.id,
      action: AuditAction.TOKEN_REFRESH,
      resource: 'auth',
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    });

    return { access_token, refresh_token: newRefreshToken };
  }

  /**
   * Revoke current session (idempotent).
   */
  async logout(
    rawRefreshToken?: string,
    metadata?: ClientMetadata,
  ): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    try {
      const payload = this.jwtService.decode(
        rawRefreshToken,
      ) as JwtRefreshPayload | null;

      if (payload?.sessionId) {
        await this.sessionsService.revokeSession(payload.sessionId);
        await this.safeAuditLog({
          userId: payload.sub,
          action: AuditAction.LOGOUT,
          resource: 'auth',
          resourceId: payload.sessionId,
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
        });
      }
    } catch (err) {
      this.logger.warn('Error during logout revocation:', err);
    }
  }

  /**
   * Revoke all active sessions for the authenticated user.
   */
  async logoutAll(userId: string, metadata?: ClientMetadata): Promise<void> {
    await this.sessionsService.revokeAllUserSessions(userId);

    await this.safeAuditLog({
      userId,
      action: AuditAction.LOGOUT_ALL,
      resource: 'auth',
      resourceId: userId,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    });
  }

  /**
   * Retrieve the current authenticated user's sanitized profile.
   */
  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return sanitizeUser(user);
  }
}
