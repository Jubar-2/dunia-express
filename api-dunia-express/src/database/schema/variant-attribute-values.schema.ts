import { index, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { variantAttributes } from './variant-attributes.schema.js';
import { productVariantAttributeValues } from './product-variant-attribute-values.schema.js';

export const variantAttributeValues = pgTable(
  'variant_attribute_values',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    attributeId: uuid('attribute_id')
      .notNull()
      .references(() => variantAttributes.id, { onDelete: 'cascade' }),
    value: varchar('value', { length: 255 }).notNull(),
    image: text('image'),
  },
  (t) => [index('variant_attribute_values_attribute_id_idx').on(t.attributeId)],
);

export const variantAttributeValuesRelations = relations(
  variantAttributeValues,
  ({ one, many }) => ({
    attribute: one(variantAttributes, {
      fields: [variantAttributeValues.attributeId],
      references: [variantAttributes.id],
    }),
    productVariantAttributeValues: many(productVariantAttributeValues),
  }),
);

export type VariantAttributeValue = typeof variantAttributeValues.$inferSelect;
export type NewVariantAttributeValue =
  typeof variantAttributeValues.$inferInsert;
