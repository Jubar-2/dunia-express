import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessTokenGuard } from './access-token.guard.js';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AccessTokenGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if route is marked with @Public()', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const context = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn(),
    } as unknown as ExecutionContext;

    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should throw UnauthorizedException when user is not attached or authentication fails', () => {
    expect(() =>
      guard.handleRequest(null, null, { message: 'jwt expired' }),
    ).toThrow(UnauthorizedException);
  });

  it('should return user if user is present and no error occurred', () => {
    const mockUser = { id: 'u1', email: 'test@example.com' };
    const result = guard.handleRequest(null, mockUser, null);
    expect(result).toBe(mockUser);
  });
});
