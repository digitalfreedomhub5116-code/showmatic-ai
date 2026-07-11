import Link from 'next/link';
import { Button } from '@/components/ui';
import { TemplateGrid } from '@/components/dashboard/template-grid';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates-data';

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-violet-950/80 to-slate-900 px-8 py-14 text-white">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Your <span className="text-violet-400">SaaS Videos</span> are easier
            <br />with Showmatic<span className="text-violet-400">.ai</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Describe the video you want to make. For example, create a product explainer for my CRM tool targeting startup founders.
          </p>

          {/* Prompt Box */}
          <div className="mx-auto mt-8 max-w-2xl">
            <Link href="/dashboard/projects/new">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur transition-colors hover:border-violet-400/30 hover:bg-white/10">
                <div className="flex-1 text-sm text-slate-400">
                  Describe the video you want to make...
                </div>
                <Button size="sm" className="shrink-0 bg-violet-600 hover:bg-violet-500">
                  Create Video
                </Button>
              </div>
            </Link>
          </div>

          {/* Filter Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <FilterChip label="Category" icon="✦" />
            <FilterChip label="Orientation" icon="⊞" />
            <Link href="/dashboard/templates">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Find Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </section>

      {/* Trending Templates */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Trending Templates</h2>
          <Link href="/dashboard/templates" className="text-sm text-muted-foreground hover:text-foreground">
            Browse all
          </Link>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TEMPLATE_CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
        <div className="mt-6">
          <TemplateGrid templates={TEMPLATES} />
        </div>
      </section>
    </div>
  );
}

function FilterChip({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10">
      <span>{icon}</span>
      {label}
      <span className="text-slate-500">▾</span>
    </button>
  );
}
