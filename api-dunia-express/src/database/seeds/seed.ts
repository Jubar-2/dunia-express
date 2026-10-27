import 'dotenv/config';
import pg from 'pg';
import net from 'node:net';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seedRolesAndPermissions } from './roll-permission.seed.js';

// Fix Node 20+ Happy Eyeballs / IPv6 ETIMEDOUT bug on dual-stack endpoints (Neon)
const origConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args: any[]) {
  if (typeof args[0] === 'object' && args[0] !== null) {
    args[0].autoSelectFamily = false;
    args[0].family = 4;
  } else if (typeof args[0] === 'number' && typeof args[1] === 'string') {
    return (origConnect as any).call(this, {
      port: args[0],
      host: args[1],
      autoSelectFamily: false,
      family: 4,
    });
  }
  return (origConnect as any).apply(this, args);
};

const { Pool } = pg;

async function runSeed() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_WrkVG0UNPa3J@ep-wild-wave-b4xrdi38-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require';

  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL is not set in environment variables.');
    process.exit(1);
  }

  const url = new URL(connectionString);

  const pool = new Pool({
    host: url.hostname,
    port: Number(url.port) || 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: {
      servername: url.hostname,
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 15000,
  });

  const db = drizzle({ client: pool });

  try {
    console.log('🌱 Starting database seed (roles & permissions)...');
    const result = await seedRolesAndPermissions(db);

    console.log('\n✅ Database seed completed successfully:');
    console.log(
      `   - Roles seeded: ${result.rolesCount} (${result.roles.join(', ')})`,
    );
    console.log(
      `   - Permissions seeded: ${result.permissionsCount} (${result.permissions.join(', ')})`,
    );
    console.log(`   - Role-Permission mappings: ${result.junctionsCount}`);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void runSeed();
