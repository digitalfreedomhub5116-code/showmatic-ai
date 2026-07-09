import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/render — Trigger video rendering for a project.
 * 
 * In production, this would use @remotion/renderer with a background job queue.
 * For MVP, we mark the project as "rendering" and simulate the pipeline.
 * Full server-side rendering requires Chromium + FFmpeg on the server (Railway Docker).
 */
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
  const { projectId } = body;

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  // Verify project belongs to user's workspace
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspace.id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  if (!project.scenes || (project.scenes as any[]).length === 0) {
    return NextResponse.json({ error: 'Project has no scenes to render' }, { status: 400 });
  }

  // Mark project as rendering
  await db
    .update(projects)
    .set({ status: 'rendering', updatedAt: new Date() })
    .where(eq(projects.id, projectId));

  // In a production system, you'd queue this to a background worker using:
  // - Inngest (recommended for Railway)
  // - BullMQ with Redis
  // - Railway cron job
  //
  // The worker would:
  // 1. Spin up headless Chromium via @remotion/renderer
  // 2. Render the SaasVideo composition frame-by-frame
  // 3. Stitch frames with FFmpeg into MP4
  // 4. Upload to Supabase Storage
  // 5. Update project.exportUrl and set status to 'rendered'
  //
  // For now, we simulate the render completing after a delay:
  simulateRender(projectId).catch(console.error);

  return NextResponse.json({
    success: true,
    message: 'Render started. Your video will be ready shortly.',
    projectId,
  });
}

/**
 * Simulate render completion (replace with real Remotion rendering in production).
 * In production, use: bundle() → selectComposition() → renderMedia()
 */
async function simulateRender(projectId: string) {
  // Wait 10 seconds to simulate rendering
  await new Promise((resolve) => setTimeout(resolve, 10000));

  try {
    await db
      .update(projects)
      .set({
        status: 'rendered',
        exportUrl: null, // Would be the Supabase Storage URL in production
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));
  } catch (error) {
    console.error('[render] Failed to update project status:', error);
    // Revert to editing status on failure
    await db
      .update(projects)
      .set({ status: 'editing', updatedAt: new Date() })
      .where(eq(projects.id, projectId));
  }
}
