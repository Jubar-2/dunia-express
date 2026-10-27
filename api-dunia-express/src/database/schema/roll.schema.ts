import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const roll = pgTable(
  'roll',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [index('roll_name_idx').on(t.name)],
);

export type Roll = typeof roll.$inferSelect;
export type NewRoll = typeof roll.$inferInsert;
