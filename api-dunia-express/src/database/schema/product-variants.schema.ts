import {
  decimal,
  index,
  integer,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { products } from './products.schema.js';

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }).notNull().unique(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal('compare_at_price', {
      precision: 10,
      scale: 2,
    }),
    quantity: integer('quantity').default(0).notNull(),
  },
  (t) => [
    index('product_variants_product_id_idx').on(t.productId),
    index('product_variants_sku_idx').on(t.sku),
  ],
);

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
