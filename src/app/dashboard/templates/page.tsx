import Link from 'next/link';
import { TemplateGrid } from '@/components/dashboard/template-grid';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates-data';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Templates' };

export default function TemplatesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trending Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a starting point and customize it to your product.
          </p>
        </div>
        <Link href="/dashboard/projects/new" className="text-sm text-primary hover:underline">
          Create from scratch
        </Link>
      </div>

      {/* Category Pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              i === 0
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="mt-8">
        <TemplateGrid templates={TEMPLATES} />
      </div>
    </div>
  );
}
