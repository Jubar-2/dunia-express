import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../../users/users.repository.js';

export interface JwtAccessPayload {
  sub: string;
  email: string;
  jti: string;
  token_type: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UsersRepository,
  ) {
    const accessSecret = configService.get<string>('JWT_ACCESS_SECRET');
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is required but not configured');
    }

    const issuer = configService.get<string>('JWT_ISSUER');
    const audience = configService.get<string>('JWT_AUDIENCE');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
      ...(issuer ? { issuer } : {}),
      ...(audience ? { audience } : {}),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<AuthenticatedUserPayload> {
    // Reject token if token_type is not 'access' (e.g. refresh token sent as access token)
    if (payload.token_type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Invalid token claims');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
