import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { collectionProducts } from './collection-products.schema.js';
import { collectionRules } from './collection-rules.schema.js';
import { collectionRuleReferences } from './collection-rule-references.schema.js';

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    thumbnail: text('thumbnail'),
    status: varchar('status', { length: 50 }).default('DRAFT').notNull(),
    totalProductNumber: integer('total_product_number').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('collections_title_idx').on(t.title),
    index('collections_status_idx').on(t.status),
  ],
);

// Aliases matching DBML field naming
(collections as any).tatalProductNumber = collections.totalProductNumber;
(collections as any).Thumbnail = collections.thumbnail;

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionProducts: many(collectionProducts),
  rules: many(collectionRules),
  referencedByRules: many(collectionRuleReferences),
}));

export type Collection = typeof collections.$inferSelect & {
  tatalProductNumber?: number;
  Thumbnail?: string | null;
};
export type NewCollection = typeof collections.$inferInsert & {
  tatalProductNumber?: number;
  Thumbnail?: string | null;
};
