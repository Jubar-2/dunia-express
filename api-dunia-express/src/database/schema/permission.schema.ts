import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const permission = pgTable('permission', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleName: text('module_name').notNull().unique(),
});

export type Permission = typeof permission.$inferSelect;
export type NewPermission = typeof permission.$inferInsert;
