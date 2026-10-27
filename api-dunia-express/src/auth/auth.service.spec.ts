import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditService } from '../audit/audit.service.js';
import { PasswordService } from '../common/security/password/password.service.js';
import { UsersRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';
import { SessionsService } from './sessions.service.js';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };

  const mockPasswordService = {
    hashPassword: vi.fn().mockResolvedValue('hashed_pw_123'),
    comparePassword: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn((key: string) => {
      switch (key) {
        case 'JWT_ACCESS_EXPIRES_IN':
          return '15m';
        case 'JWT_REFRESH_EXPIRES_IN':
          return '7d';
        case 'NODE_ENV':
          return 'test';
        default:
          return 'test-secret';
      }
    }),
    getOrThrow: vi.fn((key: string) => {
      if (key === 'JWT_ACCESS_SECRET')
        return 'test_access_secret_min_32_chars_123';
      if (key === 'JWT_REFRESH_SECRET')
        return 'test_refresh_secret_min_32_chars_456';
      return 'test_value';
    }),
  };

  const mockJwtService = {
    signAsync: vi.fn().mockImplementation((payload) => {
      if (payload.token_type === 'access')
        return Promise.resolve('signed.access.token');
      return Promise.resolve('signed.refresh.token');
    }),
    verifyAsync: vi.fn(),
    decode: vi.fn(),
  };

  const mockAuditService = {
    log: vi.fn().mockResolvedValue(undefined),
  };

  const mockSessionsService = {
    createSession: vi.fn().mockResolvedValue({ id: 'session-uuid-1' }),
    validateSession: vi.fn(),
    rotateSession: vi.fn(),
    revokeSession: vi.fn().mockResolvedValue(true),
    revokeAllUserSessions: vi.fn().mockResolvedValue(2),
    revokeTokenFamily: vi.fn().mockResolvedValue(3),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: SessionsService, useValue: mockSessionsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      password: 'StrongPassword123!',
    };

    it('should register a new user successfully and return sanitized user', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue({
        id: 'u-1',
        email: 'alice@example.com',
        fullName: 'Alice Smith',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(registerDto);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        'alice@example.com',
      );
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
        'StrongPassword123!',
      );
      expect(result.user.email).toBe('alice@example.com');
      expect((result.user as any).password).toBeUndefined();
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'REGISTER_SUCCESS', userId: 'u-1' }),
      );
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'alice@example.com',
      password: 'StrongPassword123!',
    };
    const mockUser = {
      id: 'u-1',
      email: 'alice@example.com',
      password: 'hashed_pw_123',
      fullName: 'Alice Smith',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should authenticate user, create session, and issue token pair', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.comparePassword.mockResolvedValue(true);

      const result = await service.login(loginDto, { ipAddress: '1.2.3.4' });

      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
        'StrongPassword123!',
        'hashed_pw_123',
      );
      expect(mockSessionsService.createSession).toHaveBeenCalledWith(
        'u-1',
        'signed.refresh.token',
        expect.any(String),
        expect.any(Date),
        { ipAddress: '1.2.3.4' },
      );
      expect(result.access_token).toBe('signed.access.token');
      expect(result.refresh_token).toBe('signed.refresh.token');
      expect(result.user.email).toBe('alice@example.com');
    });

    it('should reject when user does not exist without account enumeration specifics', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN_FAILED' }),
      );
    });

    it('should reject when password comparison fails', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject when user is inactive or suspended', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        status: 'suspended',
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refresh', () => {
    const rawRefreshToken = 'raw.valid.refresh.token';
    const mockRefreshPayload = {
      sub: 'u-1',
      sessionId: 'sess-1',
      familyId: 'fam-1',
      jti: 'jti-1',
      token_type: 'refresh',
    };

    it('should rotate tokens successfully when session and token are valid', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(mockRefreshPayload);
      mockUsersRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'alice@example.com',
        status: 'active',
      });
      mockSessionsService.validateSession.mockResolvedValue({
        id: 'sess-1',
        tokenFamilyId: 'fam-1',
      });
      mockSessionsService.rotateSession.mockResolvedValue({
        id: 'sess-2',
        tokenFamilyId: 'fam-1',
      });

      const result = await service.refresh(rawRefreshToken);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(rawRefreshToken, {
        secret: 'test_refresh_secret_min_32_chars_456',
      });
      expect(mockSessionsService.validateSession).toHaveBeenCalledWith(
        'sess-1',
        rawRefreshToken,
      );
      expect(mockSessionsService.rotateSession).toHaveBeenCalledWith(
        'sess-1',
        'u-1',
        'signed.refresh.token',
        'fam-1',
        expect.any(Date),
        undefined,
      );
      expect(result.access_token).toBe('signed.access.token');
      expect(result.refresh_token).toBe('signed.refresh.token');
    });

    it('should reject when refresh token signature or expiration is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(service.refresh(rawRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject and log security alert on token reuse detection', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(mockRefreshPayload);
      mockUsersRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'alice@example.com',
        status: 'active',
      });
      mockSessionsService.validateSession.mockRejectedValue(
        new UnauthorizedException('Session has already been revoked'),
      );

      await expect(service.refresh(rawRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'SECURITY_ALERT_TOKEN_REUSE',
          userId: 'u-1',
        }),
      );
    });
  });

  describe('logout & logoutAll', () => {
    it('should decode refresh token and revoke specific session', async () => {
      mockJwtService.decode.mockReturnValue({
        sub: 'u-1',
        sessionId: 'sess-1',
      });

      await service.logout('some.token');

      expect(mockSessionsService.revokeSession).toHaveBeenCalledWith('sess-1');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGOUT', resourceId: 'sess-1' }),
      );
    });

    it('should revoke all active sessions for a user on logoutAll', async () => {
      await service.logoutAll('u-1');

      expect(mockSessionsService.revokeAllUserSessions).toHaveBeenCalledWith(
        'u-1',
      );
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGOUT_ALL', userId: 'u-1' }),
      );
    });
  });

  describe('getMe', () => {
    it('should return sanitized user profile for active user', async () => {
      mockUsersRepository.findById.mockResolvedValue({
        id: 'u-1',
        email: 'alice@example.com',
        fullName: 'Alice Smith',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const profile = await service.getMe('u-1');
      expect(profile.id).toBe('u-1');
      expect(profile.email).toBe('alice@example.com');
    });

    it('should reject if user is not found or inactive', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.getMe('non-existent')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
