import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Force IPv4 on Node.js — Railway containers can't reach Supabase over IPv6
if (typeof globalThis.process !== 'undefined') {
  try {
    const dns = require('dns');
    dns.setDefaultResultOrder('ipv4first');
  } catch {}
}

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 10,
  max: 5,
});

export const db = drizzle(client, { schema });
