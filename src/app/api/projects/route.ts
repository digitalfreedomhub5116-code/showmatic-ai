import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  templateId: z.string().uuid().optional(),
});

// GET /api/projects — list all projects for current workspace
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.workspaceId, workspace.id))
    .orderBy(desc(projects.updatedAt));

  return NextResponse.json({ projects: allProjects });
}

// POST /api/projects — create a new project
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, templateId } = parsed.data;

  // If a template is provided, copy its scenes/settings
  let scenes: any = null;
  let settings: any = null;
  if (templateId) {
    const { templates } = await import('@/lib/db/schema');
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (template) {
      scenes = template.scenes;
      settings = template.settings;
    }
  }

  const [project] = await db
    .insert(projects)
    .values({
      name,
      description: description || null,
      workspaceId: workspace.id,
      createdById: user.id,
      templateId: templateId || null,
      scenes: scenes as any,
      settings: settings as any,
      status: 'draft',
    })
    .returning();

  return NextResponse.json({ project }, { status: 201 });
}
