import { db } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { TemplateGrid } from '@/components/dashboard/template-grid';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Templates' };

export default async function TemplatesPage() {
  let allTemplates: any[] = [];
  try {
    allTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true));
  } catch (e) {
    console.error('[templates] Failed to fetch:', e);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trending Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a starting point and customize it to your product.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">Browse all</span>
      </div>

      {/* Category Pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {['All', 'SaaS', 'Product Demo', 'Launch Teaser', 'Onboarding', 'Paid Ad', 'Testimonial'].map((cat, i) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              i === 0
                ? 'bg-primary text-primary-foreground'
                : 'border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="mt-8">
        <TemplateGrid templates={allTemplates} />
      </div>
    </div>
  );
}
