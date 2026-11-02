import { index, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products.schema.js';
import { categories } from './categories.schema.js';

export const setCategory = pgTable(
  'set_category',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => [
    unique('set_category_product_id_category_id_unique').on(
      t.productId,
      t.categoryId,
    ),
    index('set_category_product_id_idx').on(t.productId),
    index('set_category_category_id_idx').on(t.categoryId),
  ],
);

export const setCategoryRelations = relations(setCategory, ({ one }) => ({
  product: one(products, {
    fields: [setCategory.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [setCategory.categoryId],
    references: [categories.id],
  }),
}));

export type SetCategory = typeof setCategory.$inferSelect;
export type NewSetCategory = typeof setCategory.$inferInsert;
