import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import type { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    logoutAll: vi.fn(),
    getMe: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn((key: string) => {
      if (key === 'NODE_ENV') return 'test';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123!',
      };
      mockAuthService.register.mockResolvedValue({
        user: { id: 'u1', email: 'jane@example.com', fullName: 'Jane Doe' },
      });

      const req = {
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;
      const result = await controller.register(dto, '127.0.0.1', req);

      expect(authService.register).toHaveBeenCalledWith(dto, {
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });
      expect(result.user.email).toBe('jane@example.com');
    });
  });

  describe('login', () => {
    it('should log in, set refresh cookie, and return access token without refresh token in body', async () => {
      const dto = { email: 'jane@example.com', password: 'Password123!' };
      mockAuthService.login.mockResolvedValue({
        user: { id: 'u1', email: 'jane@example.com', fullName: 'Jane Doe' },
        access_token: 'mock.access.token',
        refresh_token: 'mock.refresh.token',
      });

      const res = { cookie: vi.fn() } as unknown as Response;
      const req = {
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const result = await controller.login(dto, '127.0.0.1', req, res);

      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'mock.refresh.token',
        expect.objectContaining({ httpOnly: true, path: '/auth' }),
      );
      expect(result).toEqual({
        user: { id: 'u1', email: 'jane@example.com', fullName: 'Jane Doe' },
        access_token: 'mock.access.token',
        token_type: 'Bearer',
        expires_in: 900,
      });
      expect((result as any).refresh_token).toBeUndefined();
    });
  });

  describe('refresh', () => {
    it('should reject when refresh cookie is missing', async () => {
      const req = { cookies: {}, headers: {} } as unknown as Request;
      const res = { cookie: vi.fn() } as unknown as Response;

      await expect(controller.refresh(req, res, '127.0.0.1')).rejects.toThrow(
        'Refresh token cookie is missing',
      );
    });

    it('should rotate token, update cookie, and return new access token', async () => {
      const req = {
        cookies: { refreshToken: 'old.refresh.token' },
        headers: { 'user-agent': 'agent' },
      } as unknown as Request;
      const res = { cookie: vi.fn() } as unknown as Response;

      mockAuthService.refresh.mockResolvedValue({
        access_token: 'new.access.token',
        refresh_token: 'new.refresh.token',
      });

      const result = await controller.refresh(req, res, '127.0.0.1');

      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new.refresh.token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual({
        access_token: 'new.access.token',
        token_type: 'Bearer',
        expires_in: 900,
      });
    });
  });

  describe('logout', () => {
    it('should revoke session and clear cookie', async () => {
      const req = {
        cookies: { refreshToken: 'active.token' },
        headers: { 'user-agent': 'agent' },
      } as unknown as Request;
      const res = { clearCookie: vi.fn() } as unknown as Response;

      const result = await controller.logout(req, res, '127.0.0.1');

      expect(authService.logout).toHaveBeenCalledWith('active.token', {
        ipAddress: '127.0.0.1',
        userAgent: 'agent',
      });
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ path: '/auth' }),
      );
      expect(result.message).toBe('Logged out successfully');
    });
  });

  describe('logoutAll', () => {
    it('should revoke all user sessions and clear cookie', async () => {
      const req = { headers: { 'user-agent': 'agent' } } as unknown as Request;
      const res = { clearCookie: vi.fn() } as unknown as Response;

      const result = await controller.logoutAll(
        'user-1',
        res,
        '127.0.0.1',
        req,
      );

      expect(authService.logoutAll).toHaveBeenCalledWith('user-1', {
        ipAddress: '127.0.0.1',
        userAgent: 'agent',
      });
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.any(Object),
      );
      expect(result.message).toContain('All active sessions have been revoked');
    });
  });

  describe('getMe', () => {
    it('should return the authenticated user profile', async () => {
      mockAuthService.getMe.mockResolvedValue({
        id: 'u1',
        email: 'jane@example.com',
        fullName: 'Jane Doe',
      });

      const result = await controller.getMe('u1');
      expect(result.id).toBe('u1');
      expect(authService.getMe).toHaveBeenCalledWith('u1');
    });
  });
});
