import {
  type AnyPgColumn,
  check,
  index,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import {
  setCategory,
  type SetCategory,
  type NewSetCategory,
} from './set-category.schema.js';

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    image: text('image'),
    color: text('color'),
    parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, {
      onDelete: 'set null',
    }),
  },
  (t) => [
    index('categories_parent_id_idx').on(t.parentId),
    check('categories_no_self_reference_check', sql`${t.id} <> ${t.parentId}`),
  ],
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_parent_children',
  }),
  children: many(categories, {
    relationName: 'category_parent_children',
  }),
  setCategories: many(setCategory),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export { setCategory, type SetCategory, type NewSetCategory };
