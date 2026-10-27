import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DRIZZLE = Symbol('DRIZZLE_DATABASE');

export type DrizzleDB = NodePgDatabase;
