import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { type Request } from 'express';

export interface JwtRefreshPayload {
  sub: string;
  sessionId: string;
  familyId: string;
  jti: string;
  token_type: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface ValidatedRefreshTokenUser {
  userId: string;
  sessionId: string;
  familyId: string;
  rawToken: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is required but not configured');
    }

    const issuer = configService.get<string>('JWT_ISSUER');
    const audience = configService.get<string>('JWT_AUDIENCE');

    super({
      jwtFromRequest: (req: Request) => {
        if (!req) return null;
        // Strictly extract from HttpOnly cookie
        if (req.cookies && req.cookies.refreshToken) {
          return req.cookies.refreshToken;
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: refreshSecret,
      passReqToCallback: true,
      ...(issuer ? { issuer } : {}),
      ...(audience ? { audience } : {}),
    });
  }

  validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): ValidatedRefreshTokenUser {
    const rawToken = req.cookies?.refreshToken;

    if (!rawToken) {
      throw new UnauthorizedException('Refresh token cookie is missing');
    }

    if (payload.token_type !== 'refresh') {
      throw new UnauthorizedException(
        'Invalid token type for refresh endpoint',
      );
    }

    if (!payload.sub || !payload.sessionId || !payload.familyId) {
      throw new UnauthorizedException('Malformed refresh token claims');
    }

    return {
      userId: payload.sub,
      sessionId: payload.sessionId,
      familyId: payload.familyId,
      rawToken,
    };
  }
}
