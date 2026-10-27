import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import {
  refreshSessions,
  type RefreshSession,
} from '../database/schema/index.js';

export interface CreateSessionParams {
  userId: string;
  tokenHash: string;
  tokenFamilyId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
}

export type RotationResult =
  | { success: true; session: RefreshSession }
  | {
      success: false;
      reason: 'already_revoked' | 'not_found';
      familyId?: string;
    };

@Injectable()
export class SessionsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async createSession(
    data: CreateSessionParams,
    tx?: DrizzleDB,
  ): Promise<RefreshSession> {
    const client = tx ?? this.db;
    const [session] = await client
      .insert(refreshSessions)
      .values({
        userId: data.userId,
        tokenHash: data.tokenHash,
        tokenFamilyId: data.tokenFamilyId,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        deviceName: data.deviceName,
      })
      .returning();

    return session;
  }

  async findById(id: string, tx?: DrizzleDB): Promise<RefreshSession | null> {
    const client = tx ?? this.db;
    const [session] = await client
      .select()
      .from(refreshSessions)
      .where(eq(refreshSessions.id, id))
      .limit(1);

    return session || null;
  }

  async findByTokenHash(
    tokenHash: string,
    tx?: DrizzleDB,
  ): Promise<RefreshSession | null> {
    const client = tx ?? this.db;
    const [session] = await client
      .select()
      .from(refreshSessions)
      .where(eq(refreshSessions.tokenHash, tokenHash))
      .limit(1);

    return session || null;
  }

  /**
   * Atomically rotates a refresh session using PostgreSQL transactions and conditional update.
   * If two requests attempt to rotate the same session concurrently, exactly one will succeed
   * in setting revoked_at, while the other will trigger reuse detection and revoke the token family.
   */
  async rotateSession(
    oldSessionId: string,
    newData: CreateSessionParams,
  ): Promise<RotationResult> {
    return await this.db.transaction(async (tx) => {
      // 1. Attempt atomic conditional update on old session
      const [revokedSession] = await tx
        .update(refreshSessions)
        .set({
          revokedAt: new Date(),
          lastUsedAt: new Date(),
        })
        .where(
          and(
            eq(refreshSessions.id, oldSessionId),
            isNull(refreshSessions.revokedAt),
          ),
        )
        .returning();

      // If no row was updated, the session either does not exist or was ALREADY revoked/rotated
      if (!revokedSession) {
        // Look up session to get tokenFamilyId for family revocation
        const [existing] = await tx
          .select()
          .from(refreshSessions)
          .where(eq(refreshSessions.id, oldSessionId))
          .limit(1);

        if (existing) {
          // Token reuse detected! Revoke the entire family
          await tx
            .update(refreshSessions)
            .set({ revokedAt: new Date() })
            .where(
              and(
                eq(refreshSessions.tokenFamilyId, existing.tokenFamilyId),
                isNull(refreshSessions.revokedAt),
              ),
            );

          return {
            success: false,
            reason: 'already_revoked',
            familyId: existing.tokenFamilyId,
          };
        }

        return { success: false, reason: 'not_found' };
      }

      // 2. Insert new session in the same family
      const [newSession] = await tx
        .insert(refreshSessions)
        .values({
          userId: newData.userId,
          tokenHash: newData.tokenHash,
          tokenFamilyId: newData.tokenFamilyId,
          expiresAt: newData.expiresAt,
          ipAddress: newData.ipAddress,
          userAgent: newData.userAgent,
          deviceName: newData.deviceName,
        })
        .returning();

      return { success: true, session: newSession };
    });
  }

  async revokeSession(id: string, tx?: DrizzleDB): Promise<boolean> {
    const client = tx ?? this.db;
    const [session] = await client
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshSessions.id, id), isNull(refreshSessions.revokedAt)))
      .returning();

    return !!session;
  }

  async revokeAllUserSessions(userId: string, tx?: DrizzleDB): Promise<number> {
    const client = tx ?? this.db;
    const updated = await client
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(refreshSessions.userId, userId),
          isNull(refreshSessions.revokedAt),
        ),
      )
      .returning();

    return updated.length;
  }

  async revokeTokenFamily(familyId: string, tx?: DrizzleDB): Promise<number> {
    const client = tx ?? this.db;
    const updated = await client
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(refreshSessions.tokenFamilyId, familyId),
          isNull(refreshSessions.revokedAt),
        ),
      )
      .returning();

    return updated.length;
  }
}
