import {
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { brands } from './brand.schema.js';
import { setCategory } from './set-category.schema.js';
import { productVariants } from './product-variants.schema.js';
import { collectionProducts } from './collection-products.schema.js';

export const productStatusEnum = pgEnum('product_status', [
  'ACTIVE',
  'DRAFT',
  'ARCHIVED',
]);

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    regularPrice: decimal('regular_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    offerPrice: decimal('offer_price', { precision: 10, scale: 2 }),
    status: productStatusEnum('status').default('DRAFT').notNull(),
    brandId: uuid('brand_id').references(() => brands.id, {
      onDelete: 'set null',
    }),

    // SEO Fields
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),
    metaKeywords: text('meta_keywords'),
    canonicalUrl: text('canonical_url'),

    // Open Graph
    ogTitle: varchar('og_title', { length: 255 }),
    ogDescription: text('og_description'),
    ogImage: text('og_image'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('products_slug_idx').on(t.slug),
    index('products_brand_id_idx').on(t.brandId),
    index('products_status_idx').on(t.status),
  ],
);

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  setCategories: many(setCategory),
  variants: many(productVariants),
  collectionProducts: many(collectionProducts),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductStatus = (typeof productStatusEnum.enumValues)[number];
