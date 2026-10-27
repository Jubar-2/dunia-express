import { Injectable, UnauthorizedException } from '@nestjs/common';
import crypto from 'node:crypto';
import {
  SessionsRepository,
  type CreateSessionParams,
} from './sessions.repository.js';
import type { RefreshSession } from '../database/schema/index.js';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  /**
   * Generates a deterministic SHA-256 hash of the raw token for secure database storage.
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createSession(
    userId: string,
    rawToken: string,
    tokenFamilyId: string,
    expiresAt: Date,
    metadata?: { ipAddress?: string; userAgent?: string; deviceName?: string },
  ): Promise<RefreshSession> {
    const tokenHash = this.hashToken(rawToken);

    return this.sessionsRepository.createSession({
      userId,
      tokenHash,
      tokenFamilyId,
      expiresAt,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      deviceName: metadata?.deviceName,
    });
  }

  async findSessionById(id: string): Promise<RefreshSession | null> {
    return this.sessionsRepository.findById(id);
  }

  /**
   * Verifies that the raw token matches the session hash and is not revoked or expired.
   */
  async validateSession(
    sessionId: string,
    rawToken: string,
  ): Promise<RefreshSession> {
    const session = await this.sessionsRepository.findById(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.revokedAt) {
      // Re-use of an already revoked session detected! Revoke the entire family
      await this.sessionsRepository.revokeTokenFamily(session.tokenFamilyId);
      throw new UnauthorizedException(
        'Session has already been revoked. Token family invalidated.',
      );
    }

    if (new Date() > new Date(session.expiresAt)) {
      await this.sessionsRepository.revokeSession(sessionId);
      throw new UnauthorizedException('Refresh token session has expired');
    }

    const computedHash = this.hashToken(rawToken);
    const hashesMatch = crypto.timingSafeEqual(
      Buffer.from(computedHash, 'hex'),
      Buffer.from(session.tokenHash, 'hex'),
    );

    if (!hashesMatch) {
      throw new UnauthorizedException('Invalid refresh token credential');
    }

    return session;
  }

  /**
   * Rotates a session atomically in a transaction.
   * If reuse is detected, revokes the entire token family.
   */
  async rotateSession(
    oldSessionId: string,
    userId: string,
    newRawToken: string,
    tokenFamilyId: string,
    expiresAt: Date,
    metadata?: { ipAddress?: string; userAgent?: string; deviceName?: string },
  ): Promise<RefreshSession> {
    const newTokenHash = this.hashToken(newRawToken);

    const rotationData: CreateSessionParams = {
      userId,
      tokenHash: newTokenHash,
      tokenFamilyId,
      expiresAt,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      deviceName: metadata?.deviceName,
    };

    const result = await this.sessionsRepository.rotateSession(
      oldSessionId,
      rotationData,
    );

    if (!result.success) {
      if (result.reason === 'already_revoked') {
        throw new UnauthorizedException(
          'Token reuse detected. All sessions in this family have been terminated.',
        );
      }
      throw new UnauthorizedException('Session could not be rotated');
    }

    return result.session;
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    return this.sessionsRepository.revokeSession(sessionId);
  }

  async revokeAllUserSessions(userId: string): Promise<number> {
    return this.sessionsRepository.revokeAllUserSessions(userId);
  }

  async revokeTokenFamily(familyId: string): Promise<number> {
    return this.sessionsRepository.revokeTokenFamily(familyId);
  }
}
