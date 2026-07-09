import dns from 'dns';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// CRITICAL: Force IPv4 resolution BEFORE any connection is made.
// Railway containers resolve Supabase hostnames to IPv6 which is unreachable.
dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
  connect_timeout: 15,
  max: 5,
  idle_timeout: 20,
  max_lifetime: 60 * 5,
});

export const db = drizzle(client, { schema });
