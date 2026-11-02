import { index, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { collectionRules } from './collection-rules.schema.js';
import { collections } from './collections.schema.js';

export const collectionRuleReferences = pgTable(
  'collection_rule_references',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ruleId: uuid('rule_id')
      .notNull()
      .references(() => collectionRules.id, { onDelete: 'cascade' }),
    referencedCollectionId: uuid('referenced_collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique('collection_rule_references_rule_ref_unique').on(
      t.ruleId,
      t.referencedCollectionId,
    ),
    index('collection_rule_refs_rule_id_idx').on(t.ruleId),
    index('collection_rule_refs_ref_collection_id_idx').on(
      t.referencedCollectionId,
    ),
  ],
);

export const collectionRuleReferencesRelations = relations(
  collectionRuleReferences,
  ({ one }) => ({
    rule: one(collectionRules, {
      fields: [collectionRuleReferences.ruleId],
      references: [collectionRules.id],
    }),
    referencedCollection: one(collections, {
      fields: [collectionRuleReferences.referencedCollectionId],
      references: [collections.id],
    }),
  }),
);

export type CollectionRuleReference =
  typeof collectionRuleReferences.$inferSelect;
export type NewCollectionRuleReference =
  typeof collectionRuleReferences.$inferInsert;
