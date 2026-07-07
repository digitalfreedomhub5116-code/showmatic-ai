import 'dotenv/config';
import postgres from 'postgres';

// Try direct connection
const url = 'postgresql://postgres.ciuncyjzdkvmqusssvcb:Pruthvispatil@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres';
console.log('Trying:', url.replace(/:[^:@]+@/, ':***@'));

const sql = postgres(url, { max: 1 });

try {
  const result = await sql`SELECT 1 as test`;
  console.log('Connected OK:', JSON.stringify(result));
} catch (e) {
  console.error('Failed:', e.message);
  // Try alternative format
  console.log('\nTrying alternative hostname...');
  const url2 = 'postgresql://postgres:Pruthvispatil@db.ciuncyjzdkvmqusssvcb.supabase.co:5432/postgres';
  console.log('Trying:', url2.replace(/:[^:@]+@/, ':***@'));
  const sql2 = postgres(url2, { max: 1 });
  try {
    const r2 = await sql2`SELECT 1 as test`;
    console.log('Connected OK with direct:', JSON.stringify(r2));
    await sql2.end();
  } catch (e2) {
    console.error('Also failed:', e2.message);
    process.exit(1);
  }
} finally {
  await sql.end();
}
