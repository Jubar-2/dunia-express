import { sql } from 'drizzle-orm';
import type { DrizzleDB } from '../database.constants.js';
import { permission } from '../schema/permission.schema.js';
import { rollJunction } from '../schema/roll-junction.schema.js';
import { roll } from '../schema/roll.schema.js';
import {
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLES,
  ROLE_PERMISSIONS_MAP,
} from './roles-permissions.data.js';

export interface SeedOptions {
  ensureTables?: boolean;
  logger?: {
    log: (msg: string) => void;
    error: (msg: string, ...args: any[]) => void;
  };
}

export interface SeedResult {
  rolesCount: number;
  permissionsCount: number;
  junctionsCount: number;
  roles: string[];
  permissions: string[];
}

export async function ensureTablesExist(db: DrizzleDB): Promise<void> {
  await db.execute(
    sql.raw(`
    CREATE TABLE IF NOT EXISTS "roll" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL UNIQUE,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "roll_name_idx" ON "roll" ("name");

    CREATE TABLE IF NOT EXISTS "permission" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "module_name" text NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS "roll_junction" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "roll_id" uuid NOT NULL REFERENCES "roll"("id") ON DELETE CASCADE,
      "permission_id" uuid NOT NULL REFERENCES "permission"("id") ON DELETE CASCADE,
      CONSTRAINT "roll_junction_roll_id_permission_id_unique" UNIQUE("roll_id", "permission_id")
    );

    DO $$ 
    BEGIN 
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'roll'
        ) THEN 
          ALTER TABLE "users" ADD COLUMN "roll" uuid REFERENCES "roll"("id") ON DELETE RESTRICT;
        END IF;
      END IF;
    END $$;
  `),
  );
}

export async function seedRolesAndPermissions(
  db: DrizzleDB,
  options: SeedOptions = {},
): Promise<SeedResult> {
  const logger = options.logger ?? console;

  if (options.ensureTables ?? true) {
    logger.log('Ensuring tables "roll", "permission", and "roll_junction" exist...');
    await ensureTablesExist(db);
  }

  logger.log('Seeding permissions...');
  for (const perm of DEFAULT_PERMISSIONS) {
    await db
      .insert(permission)
      .values({ moduleName: perm.moduleName })
      .onConflictDoNothing();
  }

  logger.log('Seeding roles (rolls)...');
  for (const r of DEFAULT_ROLES) {
    await db
      .insert(roll)
      .values({ name: r.name })
      .onConflictDoNothing();
  }

  // Fetch all existing roles and permissions to retrieve their IDs
  const existingRoles = await db.select().from(roll);
  const existingPermissions = await db.select().from(permission);

  const roleMap = new Map<string, string>(
    existingRoles.map((r) => [r.name, r.id]),
  );
  const permissionMap = new Map<string, string>(
    existingPermissions.map((p) => [p.moduleName, p.id]),
  );

  logger.log('Linking roles and permissions in roll_junction...');
  const junctionsToInsert: { rollId: string; permissionId: string }[] = [];

  for (const [roleName, permissionNames] of Object.entries(
    ROLE_PERMISSIONS_MAP,
  )) {
    const rollId = roleMap.get(roleName);
    if (!rollId) {
      continue;
    }

    for (const permName of permissionNames) {
      const permissionId = permissionMap.get(permName);
      if (permissionId) {
        junctionsToInsert.push({ rollId, permissionId });
      }
    }
  }

  if (junctionsToInsert.length > 0) {
    for (const junction of junctionsToInsert) {
      await db
        .insert(rollJunction)
        .values(junction)
        .onConflictDoNothing();
    }
  }

  const allJunctions = await db.select().from(rollJunction);

  logger.log(
    `Seeding complete: ${existingRoles.length} roles, ${existingPermissions.length} permissions, ${allJunctions.length} junctions linked.`,
  );

  return {
    rolesCount: existingRoles.length,
    permissionsCount: existingPermissions.length,
    junctionsCount: allJunctions.length,
    roles: existingRoles.map((r) => r.name),
    permissions: existingPermissions.map((p) => p.moduleName),
  };
}
