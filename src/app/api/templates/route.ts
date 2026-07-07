import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// GET /api/templates — list all public templates
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allTemplates = await db
    .select()
    .from(templates)
    .where(eq(templates.isPublic, true));

  return NextResponse.json({ templates: allTemplates });
}
