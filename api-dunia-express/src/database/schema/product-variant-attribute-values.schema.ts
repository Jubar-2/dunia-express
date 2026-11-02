import { index, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productVariants } from './product-variants.schema.js';
import { variantAttributeValues } from './variant-attribute-values.schema.js';

export const productVariantAttributeValues = pgTable(
  'product_variant_attribute_values',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productVariantId: uuid('product_variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    attributeValueId: uuid('attribute_value_id')
      .notNull()
      .references(() => variantAttributeValues.id, { onDelete: 'cascade' }),
  },
  (t) => [
    unique('product_variant_attribute_values_variant_attribute_unique').on(
      t.productVariantId,
      t.attributeValueId,
    ),
    index('product_variant_attr_values_product_variant_id_idx').on(
      t.productVariantId,
    ),
    index('product_variant_attr_values_attribute_value_id_idx').on(
      t.attributeValueId,
    ),
  ],
);

export const productVariantAttributeValuesRelations = relations(
  productVariantAttributeValues,
  ({ one }) => ({
    productVariant: one(productVariants, {
      fields: [productVariantAttributeValues.productVariantId],
      references: [productVariants.id],
    }),
    attributeValue: one(variantAttributeValues, {
      fields: [productVariantAttributeValues.attributeValueId],
      references: [variantAttributeValues.id],
    }),
  }),
);

export type ProductVariantAttributeValue =
  typeof productVariantAttributeValues.$inferSelect;
export type NewProductVariantAttributeValue =
  typeof productVariantAttributeValues.$inferInsert;
