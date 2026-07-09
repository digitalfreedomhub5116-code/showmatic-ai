'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  durationSeconds: number;
  scenes: any[];
}

interface TemplateGridProps {
  templates: Template[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sceneColors = getSceneGradient(template.category);

  async function handleUse() {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${template.name} - ${new Date().toLocaleDateString()}`,
          templateId: template.id,
        }),
      });
      if (res.ok) {
        const { project } = await res.json();
        router.push(`/dashboard/projects/${project.id}/edit`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Area */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ background: sceneColors }}
      >
        {/* Animated Scene Preview on Hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          {isHovered ? (
            <HoverPreview scenes={template.scenes} category={template.category} />
          ) : (
            <StaticPreview name={template.name} category={template.category} />
          )}
        </div>

        {/* Play / Arrow buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-white/30">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            onClick={handleUse}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-white/30"
          >
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {template.durationSeconds}s
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-sm font-medium truncate">{template.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{template.category}</div>
      </div>
    </div>
  );
}

function StaticPreview({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-lg font-bold text-white/90 drop-shadow-lg">{name}</div>
      <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur">
        {category}
      </div>
    </div>
  );
}

function HoverPreview({ scenes, category }: { scenes: any[]; category: string }) {
  // Animate through scenes on hover
  const [currentScene, setCurrentScene] = useState(0);

  // Auto-advance scenes
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      if (scenes && scenes.length > 0) {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
      }
    }, 1500);
  }

  const scene = scenes?.[currentScene];
  if (!scene) return <StaticPreview name="Preview" category={category} />;

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in px-3">
      <div className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-300">
        {scene.type}
      </div>
      <div className="text-base font-bold text-white drop-shadow-lg">
        {scene.title}
      </div>
      {scene.narration && (
        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
          {scene.narration}
        </p>
      )}
      {/* Scene progress dots */}
      <div className="mt-2 flex gap-1">
        {scenes.map((_: any, i: number) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === currentScene ? 'w-4 bg-violet-400' : 'w-1 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function getSceneGradient(category: string): string {
  const gradients: Record<string, string> = {
    Explainer: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    Product: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    Marketing: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #11001c 100%)',
    'Social Proof': 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)',
  };
  return gradients[category] || 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)';
}
