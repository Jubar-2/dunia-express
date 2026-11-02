import {
  index,
  integer,
  numeric,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products.schema.js';
import { productVariantAttributeValues } from './product-variant-attribute-values.schema.js';

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }).notNull().unique(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: numeric('compare_at_price', {
      precision: 12,
      scale: 2,
    }),
    quantity: integer('quantity').default(0).notNull(),
  },
  (t) => [
    index('product_variants_product_id_idx').on(t.productId),
    index('product_variants_sku_idx').on(t.sku),
  ],
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    attributeValues: many(productVariantAttributeValues),
  }),
);

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
