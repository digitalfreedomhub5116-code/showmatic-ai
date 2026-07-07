import Link from 'next/link';
import { ShowmaticLogo } from '@/components/logo';
import { Button } from '@/components/ui';

const features = [
  {
    title: 'SaaS-Specific Templates',
    description: 'Start with professionally designed templates built for product demos, launches, and onboarding.',
    icon: '🎬',
  },
  {
    title: 'AI Script Generation',
    description: 'Describe your product and let AI write a compelling video script in seconds.',
    icon: '✨',
  },
  {
    title: 'Scene-Based Editing',
    description: 'Build your video scene by scene. Drag, drop, reorder — no timeline complexity.',
    icon: '🎞️',
  },
  {
    title: 'Brand Kit Integration',
    description: 'Upload your colors, fonts, and logo once. Every video stays on brand automatically.',
    icon: '🎨',
  },
  {
    title: 'Fast Preview & Export',
    description: 'Preview your video in real time and export in 1080p — ready for your website or ads.',
    icon: '🚀',
  },
  {
    title: 'Asset Library',
    description: 'Store and reuse screenshots, logos, and product images across all your projects.',
    icon: '📁',
  },
];

const useCases = [
  'Product Explainer',
  'Feature Announcement',
  'Onboarding Video',
  'Homepage Hero',
  'Paid Ad Creative',
  'Launch Teaser',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-violet-50/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <ShowmaticLogo compact />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#use-cases" className="transition-colors hover:text-foreground">Use Cases</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
              SaaS explainer videos, made simple
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Create polished SaaS videos in minutes.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Choose a template, add your text and screenshots, preview the story, and export — no complex video editing required.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/signup">
                <Button size="xl">Start Free</Button>
              </Link>
              <a href="#use-cases">
                <Button variant="outline" size="xl">Browse Templates</Button>
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-violet-100">
            <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Template preview</div>
                  <div className="text-xl font-bold">Launch Video</div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">1080p</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="font-medium">Hook Scene</div>
                  <div className="mt-1 text-sm text-slate-400">Problem + promise</div>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="font-medium">Feature Scene</div>
                  <div className="mt-1 text-sm text-slate-400">UI screenshot + caption</div>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="font-medium">Social Proof</div>
                  <div className="mt-1 text-sm text-slate-400">Trust metrics</div>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="font-medium">CTA Scene</div>
                  <div className="mt-1 text-sm text-slate-400">Book a demo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to ship great videos</h2>
          <p className="mt-3 text-muted-foreground">Built specifically for SaaS teams who move fast.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight">Template categories</h2>
        <p className="mt-3 text-muted-foreground">Pick a starting point and customize it to your product.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {useCases.map((u) => (
            <div
              key={u}
              className="rounded-xl border bg-card p-4 text-center text-sm font-semibold transition-shadow hover:shadow-md"
            >
              {u}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { name: 'Free', price: '$0', period: '/mo', features: ['3 videos/month', '720p export', '1 workspace'] },
            { name: 'Starter', price: '$29', period: '/mo', features: ['20 videos/month', '1080p export', 'Brand kit', 'AI scripts'], highlight: true },
            { name: 'Pro', price: '$79', period: '/mo', features: ['Unlimited videos', '1080p export', 'Priority rendering', 'Team access', 'API'] },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 ${plan.highlight ? 'border-violet-300 bg-violet-50/50 shadow-lg shadow-violet-100' : 'bg-card'}`}
            >
              <div className="text-sm font-medium text-muted-foreground">{plan.name}</div>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-6 block">
                <Button variant={plan.highlight ? 'default' : 'outline'} className="w-full">
                  {plan.highlight ? 'Get Started' : 'Choose Plan'}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <ShowmaticLogo compact />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Showmatic AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
