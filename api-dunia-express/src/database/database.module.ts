import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import net from 'node:net';
import { DRIZZLE } from './database.constants.js';

export const DB_POOL = Symbol('DB_POOL');

const { Pool } = pg;

// Workaround for Node 20+ Happy Eyeballs / IPv6 ETIMEDOUT bug on dual-stack endpoints (Neon)
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

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DB_POOL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString =
          configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error(
            'DATABASE_URL is not defined in the environment variables.',
          );
        }

        const url = new URL(connectionString);

        return new Pool({
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
      },
    },
    {
      provide: DRIZZLE,
      inject: [DB_POOL],
      useFactory: (pool: pg.Pool) => {
        return drizzle({ client: pool });
      },
    },
  ],
  exports: [DB_POOL, DRIZZLE],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DB_POOL) private pool: pg.Pool) {}

  async onApplicationShutdown() {
    try {
      await this.pool.end();
    } catch {}
  }
}
