import { pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { roll } from './roll.schema.js';
import { permission } from './permission.schema.js';

export const rollJunction = pgTable(
  'roll_junction',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    rollId: uuid('roll_id')
      .notNull()
      .references(() => roll.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade' }),
  },
  (t) => [
    unique('roll_junction_roll_id_permission_id_unique').on(
      t.rollId,
      t.permissionId,
    ),
  ],
);

export type RollJunction = typeof rollJunction.$inferSelect;
export type NewRollJunction = typeof rollJunction.$inferInsert;
