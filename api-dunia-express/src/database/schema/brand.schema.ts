import { index, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const brand = pgTable(
  'brand',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    logo: text('logo'),
  },
  (t) => [index('brand_name_idx').on(t.name)],
);


export type Brand = typeof brand.$inferSelect;
export type NewBrand = typeof brand.$inferInsert;
