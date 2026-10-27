import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import net from 'node:net';

// Fix Node 20+ Happy Eyeballs / IPv6 ETIMEDOUT bug on dual-stack Postgres endpoints (e.g. Neon)
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

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});