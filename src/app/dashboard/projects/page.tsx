import Link from 'next/link';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const workspace = await getUserWorkspace(user.id);
  let allProjects: typeof projects.$inferSelect[] = [];

  if (workspace) {
    allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspace.id))
      .orderBy(desc(projects.updatedAt));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">All your video projects in one place.</p>
        </div>
        <Link href="/dashboard/templates">
          <Button>New Project</Button>
        </Link>
      </div>

      {allProjects.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl">📁</div>
            <h2 className="mt-4 text-lg font-semibold">No projects yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Start by picking a template. Your projects will appear here as you create them.
            </p>
            <Link href="/dashboard/templates" className="mt-6">
              <Button>Browse Templates</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {allProjects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="flex items-center justify-between rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="font-semibold">{p.name}</div>
                {p.description && (
                  <div className="mt-0.5 text-sm text-muted-foreground">{p.description}</div>
                )}
                <div className="mt-1 text-xs text-muted-foreground">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor(p.status)}`}>
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    scripting: 'bg-blue-100 text-blue-700',
    storyboarding: 'bg-purple-100 text-purple-700',
    editing: 'bg-amber-100 text-amber-700',
    rendering: 'bg-orange-100 text-orange-700',
    rendered: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-500',
  };
  return colors[status] || colors.draft;
}
