import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import type { Scene } from '@/lib/db/schema/projects';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) return notFound();

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.workspaceId, workspace.id)))
    .limit(1);

  if (!project) return notFound();

  const scenes = (project.scenes || []) as Scene[];
  const steps = ['Setup', 'Script', 'Storyboard', 'Editor'];
  const currentStepIndex = getStepIndex(project.status);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to projects
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
          )}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`rounded-lg border p-4 text-center text-sm font-medium ${
              i <= currentStepIndex ? 'border-primary/30 bg-primary/5 text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className="text-xs text-muted-foreground mb-1">Step {i + 1}</div>
            {step}
          </div>
        ))}
      </div>

      {/* Scenes */}
      {scenes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Scenes ({scenes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenes.map((scene, i) => (
                <div key={scene.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{scene.title}</div>
                      <span className="text-xs text-muted-foreground">{scene.durationSeconds}s</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{scene.content}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs capitalize">{scene.type}</span>
                      {scene.transition && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs">{scene.transition}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Script */}
      {project.script && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Script</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {project.script}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    draft: 0,
    scripting: 1,
    storyboarding: 2,
    editing: 3,
    rendering: 3,
    rendered: 3,
    archived: 3,
  };
  return map[status] ?? 0;
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
