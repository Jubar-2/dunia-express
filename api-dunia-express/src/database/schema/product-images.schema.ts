import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { products } from './products.schema.js';
import { productVariants } from './product-variants.schema.js';

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id').references(() => productVariants.id, {
      onDelete: 'cascade',
    }),
    url: text('url').notNull(),
    altText: varchar('alt_text', { length: 255 }),
    isThumbnail: boolean('is_thumbnail').default(false).notNull(),
    position: integer('position').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('product_images_product_id_idx').on(t.productId),
    index('product_images_variant_id_idx').on(t.variantId),
    index('product_images_is_thumbnail_idx').on(t.isThumbnail),
  ],
);

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
