import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { collectionRules } from './collection-rules.schema.js';

export const conditions = pgTable(
  'conditions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ruleId: uuid('rule_id')
      .notNull()
      .references(() => collectionRules.id, { onDelete: 'cascade' }),
    targetType: varchar('target_type', { length: 100 }).notNull(),
    field: varchar('field', { length: 100 }).notNull(),
    operator: varchar('operator', { length: 50 }).notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index('conditions_rule_id_idx').on(t.ruleId)],
);

export const conditionsRelations = relations(conditions, ({ one }) => ({
  rule: one(collectionRules, {
    fields: [conditions.ruleId],
    references: [collectionRules.id],
  }),
}));

export type Condition = typeof conditions.$inferSelect;
export type NewCondition = typeof conditions.$inferInsert;
