import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SessionsRepository } from './sessions.repository.js';
import { SessionsService } from './sessions.service.js';

describe('SessionsService', () => {
  let service: SessionsService;

  const mockSessionsRepo = {
    createSession: vi.fn(),
    findById: vi.fn(),
    findByTokenHash: vi.fn(),
    rotateSession: vi.fn(),
    revokeSession: vi.fn(),
    revokeAllUserSessions: vi.fn(),
    revokeTokenFamily: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: SessionsRepository, useValue: mockSessionsRepo },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashToken', () => {
    it('should produce a deterministic 64-char SHA-256 hex string', () => {
      const hash1 = service.hashToken('my-secret-token');
      const hash2 = service.hashToken('my-secret-token');
      const hash3 = service.hashToken('different-token');

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      expect(hash1).not.toBe(hash3);
    });
  });

  describe('createSession', () => {
    it('should hash token and call repository', async () => {
      const expiresAt = new Date(Date.now() + 100000);
      mockSessionsRepo.createSession.mockResolvedValue({ id: 'sess-1' });

      const session = await service.createSession(
        'user-1',
        'raw-token',
        'family-1',
        expiresAt,
        { ipAddress: '127.0.0.1' },
      );

      expect(mockSessionsRepo.createSession).toHaveBeenCalledWith({
        userId: 'user-1',
        tokenHash: service.hashToken('raw-token'),
        tokenFamilyId: 'family-1',
        expiresAt,
        ipAddress: '127.0.0.1',
        userAgent: undefined,
        deviceName: undefined,
      });
      expect(session.id).toBe('sess-1');
    });
  });

  describe('validateSession', () => {
    const rawToken = 'test-raw-token';
    const validHash =
      '4b1dc7150914f6b2824cfabf532a87d096144e5e7710b1473fa58a74ecff545b'; // SHA-256 for 'test-raw-token'

    it('should throw if session not found in database', async () => {
      mockSessionsRepo.findById.mockResolvedValue(null);

      await expect(service.validateSession('s1', rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should revoke entire family if session is already revoked (reuse detection)', async () => {
      mockSessionsRepo.findById.mockResolvedValue({
        id: 's1',
        tokenFamilyId: 'fam-1',
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 100000),
        tokenHash: validHash,
      });

      await expect(service.validateSession('s1', rawToken)).rejects.toThrow(
        'Session has already been revoked',
      );
      expect(mockSessionsRepo.revokeTokenFamily).toHaveBeenCalledWith('fam-1');
    });

    it('should throw if session has expired', async () => {
      mockSessionsRepo.findById.mockResolvedValue({
        id: 's1',
        tokenFamilyId: 'fam-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() - 10000),
        tokenHash: validHash,
      });

      await expect(service.validateSession('s1', rawToken)).rejects.toThrow(
        'expired',
      );
      expect(mockSessionsRepo.revokeSession).toHaveBeenCalledWith('s1');
    });

    it('should throw if token hash does not match stored hash', async () => {
      mockSessionsRepo.findById.mockResolvedValue({
        id: 's1',
        tokenFamilyId: 'fam-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
        tokenHash: service.hashToken('completely-different-token'),
      });

      await expect(service.validateSession('s1', rawToken)).rejects.toThrow(
        'Invalid refresh token credential',
      );
    });

    it('should return session if token hash matches and session is active', async () => {
      const activeSession = {
        id: 's1',
        tokenFamilyId: 'fam-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
        tokenHash: service.hashToken(rawToken),
      };
      mockSessionsRepo.findById.mockResolvedValue(activeSession);

      const result = await service.validateSession('s1', rawToken);
      expect(result).toEqual(activeSession);
    });
  });

  describe('rotateSession', () => {
    it('should rotate session atomically when valid', async () => {
      mockSessionsRepo.rotateSession.mockResolvedValue({
        success: true,
        session: { id: 's2', tokenFamilyId: 'fam-1' },
      });

      const rotated = await service.rotateSession(
        's1',
        'u1',
        'new-raw-token',
        'fam-1',
        new Date(Date.now() + 100000),
      );

      expect(rotated.id).toBe('s2');
    });

    it('should throw UnauthorizedException and explain reuse when already revoked', async () => {
      mockSessionsRepo.rotateSession.mockResolvedValue({
        success: false,
        reason: 'already_revoked',
      });

      await expect(
        service.rotateSession(
          's1',
          'u1',
          'new-raw-token',
          'fam-1',
          new Date(Date.now() + 100000),
        ),
      ).rejects.toThrow('Token reuse detected');
    });
  });
});
