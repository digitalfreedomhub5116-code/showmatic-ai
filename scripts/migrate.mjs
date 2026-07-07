import 'dotenv/config';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

console.log('Running migration...');

const migrationSql = readFileSync(join(process.cwd(), 'drizzle', '0000_noisy_lockheed.sql'), 'utf-8');
const statements = migrationSql
  .split('--> statement-breakpoint')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Executing ${statements.length} statements...`);

for (let i = 0; i < statements.length; i++) {
  try {
    await sql.unsafe(statements[i]);
    console.log(`  ✓ ${i + 1}/${statements.length}`);
  } catch (err) {
    if (err.code === '42710' || err.code === '42P07') {
      console.log(`  ⊘ ${i + 1}/${statements.length} (already exists)`);
    } else {
      console.error(`  ✗ ${i + 1}/${statements.length}:`, err.message);
      await sql.end();
      process.exit(1);
    }
  }
}

console.log('\n✓ Migration complete!');
await sql.end();
