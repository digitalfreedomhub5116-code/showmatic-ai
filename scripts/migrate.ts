import 'dotenv/config';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

  console.log('Connecting to database...');

  // Read migration file
  const migrationPath = join(process.cwd(), 'drizzle', '0000_noisy_lockheed.sql');
  const migrationSql = readFileSync(migrationPath, 'utf-8');

  // Split by statement breakpoint and execute each
  const statements = migrationSql
    .split('--> statement-breakpoint')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Running ${statements.length} statements...`);

  for (let i = 0; i < statements.length; i++) {
    try {
      await sql.unsafe(statements[i]);
      console.log(`  ✓ Statement ${i + 1}/${statements.length}`);
    } catch (err: any) {
      // Skip if already exists
      if (err.code === '42710' || err.code === '42P07') {
        console.log(`  ⊘ Statement ${i + 1}/${statements.length} (already exists, skipped)`);
      } else {
        console.error(`  ✗ Statement ${i + 1}/${statements.length} failed:`, err.message);
        throw err;
      }
    }
  }

  console.log('\n✓ Migration complete!');
  await sql.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
