import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dns from 'dns';

// Force IPv4 resolution — Railway can't reach Supabase over IPv6
dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
});
export const db = drizzle(client, { schema });
