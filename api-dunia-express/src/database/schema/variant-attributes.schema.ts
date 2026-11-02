import { index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { variantAttributeValues } from './variant-attribute-values.schema.js';

export const variantAttributes = pgTable(
  'variant_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
  },
  (t) => [index('variant_attributes_name_idx').on(t.name)],
);

export const variantAttributesRelations = relations(
  variantAttributes,
  ({ many }) => ({
    values: many(variantAttributeValues),
  }),
);

export type VariantAttribute = typeof variantAttributes.$inferSelect;
export type NewVariantAttribute = typeof variantAttributes.$inferInsert;
