import { db } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, Button } from '@/components/ui';
import { CreateProjectButton } from '@/components/dashboard/create-project-button';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Templates' };

export default async function TemplatesPage() {
  const allTemplates = await db
    .select()
    .from(templates)
    .where(eq(templates.isPublic, true));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Template Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose a SaaS-specific starting point for your video.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allTemplates.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.category} &middot; {t.durationSeconds}s
                  </p>
                </div>
                <CreateProjectButton templateId={t.id} templateName={t.name} />
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-4 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {(t.scenes as any[])?.map((scene: any) => (
                    <span
                      key={scene.id}
                      className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300"
                    >
                      {scene.title}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
