import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandKits } from '@/lib/db/schema';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const brandKitSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }).optional(),
  logoUrl: z.string().url().optional().nullable(),
});

// GET /api/brand-kit — get brand kit for current workspace
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const [brandKit] = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.workspaceId, workspace.id))
    .limit(1);

  if (!brandKit) {
    // Return default brand kit
    return NextResponse.json({
      brandKit: {
        colors: { primary: '#7C3AED', secondary: '#06B6D4', accent: '#F59E0B', background: '#FFFFFF', text: '#0F172A' },
        fonts: { heading: 'Inter', body: 'Inter' },
        logoUrl: null,
      },
    });
  }

  return NextResponse.json({ brandKit });
}

// PUT /api/brand-kit — create or update brand kit
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const body = await request.json();
  const parsed = brandKitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { colors, fonts, logoUrl } = parsed.data;

  // Upsert — insert or update
  const [existing] = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.workspaceId, workspace.id))
    .limit(1);

  let brandKit;
  if (existing) {
    [brandKit] = await db
      .update(brandKits)
      .set({
        colors,
        fonts: fonts || null,
        logoUrl: logoUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(brandKits.workspaceId, workspace.id))
      .returning();
  } else {
    [brandKit] = await db
      .insert(brandKits)
      .values({
        workspaceId: workspace.id,
        colors,
        fonts: fonts || null,
        logoUrl: logoUrl || null,
      })
      .returning();
  }

  return NextResponse.json({ brandKit });
}
