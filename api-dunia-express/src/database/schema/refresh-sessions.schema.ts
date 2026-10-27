import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema.js';

export const refreshSessions = pgTable(
  'refresh_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    tokenFamilyId: text('token_family_id').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    deviceName: text('device_name'),
  },
  (t) => [
    index('refresh_sessions_user_id_idx').on(t.userId),
    index('refresh_sessions_token_family_id_idx').on(t.tokenFamilyId),
    index('refresh_sessions_token_hash_idx').on(t.tokenHash),
    index('refresh_sessions_expires_at_idx').on(t.expiresAt),
  ],
);

export type RefreshSession = typeof refreshSessions.$inferSelect;
export type NewRefreshSession = typeof refreshSessions.$inferInsert;
