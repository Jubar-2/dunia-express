import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { collections } from './collections.schema.js';
import { conditions } from './conditions.schema.js';
import { collectionRuleReferences } from './collection-rule-references.schema.js';

export const collectionRuleActionTypeEnum = pgEnum(
  'collection_rule_action_type',
  ['INCLUDE', 'EXCLUDE'],
);

export const collectionRules = pgTable(
  'collection_rules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    targetType: varchar('target_type', { length: 100 }).notNull(),
    actionType: collectionRuleActionTypeEnum('action_type')
      .default('INCLUDE')
      .notNull(),
    matchType: varchar('match_type', { length: 50 }).notNull(),
    position: integer('position').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('collection_rules_collection_id_idx').on(t.collectionId),
    index('collection_rules_position_idx').on(t.position),
  ],
);

export const collectionRulesRelations = relations(
  collectionRules,
  ({ one, many }) => ({
    collection: one(collections, {
      fields: [collectionRules.collectionId],
      references: [collections.id],
    }),
    conditions: many(conditions),
    references: many(collectionRuleReferences),
  }),
);

export type CollectionRule = typeof collectionRules.$inferSelect;
export type NewCollectionRule = typeof collectionRules.$inferInsert;
export type CollectionRuleActionType =
  (typeof collectionRuleActionTypeEnum.enumValues)[number];
