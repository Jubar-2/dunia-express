import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AccessTokenStrategy,
  type JwtAccessPayload,
} from './access-token.strategy.js';

describe('AccessTokenStrategy', () => {
  let strategy: AccessTokenStrategy;

  const mockUsersRepository = {
    findById: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn((key: string) => {
      if (key === 'JWT_ACCESS_SECRET')
        return 'test_secret_for_access_token_min_32';
      return null;
    }),
  } as unknown as ConfigService;

  beforeEach(() => {
    strategy = new AccessTokenStrategy(
      mockConfigService,
      mockUsersRepository as any,
    );
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should reject when token_type is not "access" (e.g. refresh token presented as access token)', async () => {
    const refreshAsAccess: JwtAccessPayload = {
      sub: 'u-1',
      email: 'user@example.com',
      jti: 'jti-1',
      token_type: 'refresh',
    };

    await expect(strategy.validate(refreshAsAccess)).rejects.toThrow(
      new UnauthorizedException('Invalid token type'),
    );
  });

  it('should reject when user does not exist in database', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const validPayload: JwtAccessPayload = {
      sub: 'u-1',
      email: 'user@example.com',
      jti: 'jti-1',
      token_type: 'access',
    };

    await expect(strategy.validate(validPayload)).rejects.toThrow(
      'User account is inactive or not found',
    );
  });

  it('should reject when user account status is suspended or pending', async () => {
    mockUsersRepository.findById.mockResolvedValue({
      id: 'u-1',
      email: 'user@example.com',
      status: 'suspended',
    });

    const validPayload: JwtAccessPayload = {
      sub: 'u-1',
      email: 'user@example.com',
      jti: 'jti-1',
      token_type: 'access',
    };

    await expect(strategy.validate(validPayload)).rejects.toThrow(
      'User account is inactive or not found',
    );
  });

  it('should return sanitized user object when token and user are active', async () => {
    mockUsersRepository.findById.mockResolvedValue({
      id: 'u-1',
      email: 'user@example.com',
      status: 'active',
    });

    const validPayload: JwtAccessPayload = {
      sub: 'u-1',
      email: 'user@example.com',
      jti: 'jti-1',
      token_type: 'access',
    };

    const result = await strategy.validate(validPayload);
    expect(result).toEqual({ id: 'u-1', email: 'user@example.com' });
  });
});
