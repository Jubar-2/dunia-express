import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { roll } from './roll.schema.js';

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'suspended',
  'pending',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  avatar: text('avatar'),
  status: userStatusEnum('status').default('active'),
  roll: uuid('roll')
    .references(() => roll.id, { onDelete: 'restrict' })
    .unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
