import { index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users.schema.js';

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    action: text('action').notNull(),
    resource: text('resource').notNull(),
    resourceId: text('resource_id'),
    metadata: jsonb('metadata'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('audit_logs_user_id_idx').on(t.userId),
    index('audit_logs_action_idx').on(t.action),
    index('audit_logs_resource_idx').on(t.resource),
    index('audit_logs_created_at_idx').on(t.createdAt),
  ],
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
