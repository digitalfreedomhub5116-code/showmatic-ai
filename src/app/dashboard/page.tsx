import Link from 'next/link';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const workspace = await getUserWorkspace(user.id);
  const displayName = user.name || user.email.split('@')[0];

  // Fetch real project data
  let recentProjects: typeof projects.$inferSelect[] = [];
  let projectCount = 0;

  if (workspace) {
    recentProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspace.id))
      .orderBy(desc(projects.updatedAt))
      .limit(5);

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspace.id));
    projectCount = allProjects.length;
  }

  const exportCount = recentProjects.filter(p => p.status === 'rendered').length;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
          </div>
          <Link href="/dashboard/templates">
            <Button>Create New Video</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Projects" value={String(projectCount)} />
        <StatCard label="Exports" value={String(exportCount)} />
        <StatCard label="Credits Left" value="3" />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Recent projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl">🎬</div>
                <p className="mt-3 text-sm text-muted-foreground">
                  No projects yet. Create your first video to get started.
                </p>
                <Link href="/dashboard/templates" className="mt-4">
                  <Button variant="outline" size="sm">Browse Templates</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Updated {formatRelativeTime(p.updatedAt)}
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/templates"
              className="block rounded-lg bg-foreground px-4 py-3.5 font-medium text-background transition-opacity hover:opacity-90"
            >
              Pick a template
            </Link>
            <Link
              href="/dashboard/brand-kit"
              className="block rounded-lg border px-4 py-3.5 font-medium transition-colors hover:bg-muted"
            >
              Set up brand kit
            </Link>
            <Link
              href="/dashboard/assets"
              className="block rounded-lg border px-4 py-3.5 font-medium transition-colors hover:bg-muted"
            >
              Upload assets
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-bold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    scripting: 'bg-blue-100 text-blue-700',
    storyboarding: 'bg-purple-100 text-purple-700',
    editing: 'bg-amber-100 text-amber-700',
    rendering: 'bg-orange-100 text-orange-700',
    rendered: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}
