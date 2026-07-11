'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { TemplateData, TemplateScene } from '@/lib/templates-data';

interface TemplateGridProps {
  templates: TemplateData[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

function TemplateCard({ template }: { template: TemplateData }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const previewUrl = template.previewUrl || `/previews/${template.id}.webm`;

  useEffect(() => {
    if (isHovered) {
      // Try to play video
      if (videoRef.current && !videoError) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => setVideoError(true));
      }
      // Fallback: animate scenes
      if (videoError || !videoRef.current) {
        intervalRef.current = setInterval(() => {
          setCurrentSceneIndex((prev) => (prev + 1) % template.scenes.length);
        }, 1800);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentSceneIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, videoError, template.scenes.length]);

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

  const scene = template.scenes[currentSceneIndex];

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleUse}
    >
      {/* Preview Area */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ background: template.gradient }}
      >
        {/* Video Preview (plays on hover) */}
        <video
          ref={videoRef}
          src={previewUrl}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isHovered && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scene Content (fallback or static) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-5 text-center transition-all duration-500 ${
          isHovered && !videoError ? 'opacity-0' : 'opacity-100'
        }`}>
          {isHovered && scene ? (
            <div className="animate-fade-in flex flex-col items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300 backdrop-blur">
                {scene.type.replace('_', ' ')}
              </span>
              <h3 className="text-sm font-bold text-white drop-shadow-lg">
                {scene.title}
              </h3>
              <p className="text-[11px] leading-relaxed text-white/60 line-clamp-3">
                &ldquo;{scene.narration}&rdquo;
              </p>
              {/* Scene progress dots */}
              <div className="mt-3 flex gap-1">
                {template.scenes.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentSceneIndex ? 'w-4 bg-violet-400' : 'w-1.5 bg-white/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-base font-bold text-white drop-shadow-lg">
                {template.name}
              </h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur">
                {template.category}
              </span>
              <span className="text-[10px] text-white/40">
                {template.scenes.length} scenes · {template.durationSeconds}s
              </span>
            </div>
          )}
        </div>

        {/* Hover overlay buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition hover:bg-black/60">
            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition hover:bg-black/60">
            <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Duration badge */}
        <div className="absolute top-2.5 right-2.5 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
          {template.durationSeconds}s
        </div>
      </div>

      {/* Bottom info */}
      <div className="p-3">
        <div className="text-sm font-medium truncate">{template.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{template.category} · {template.scenes.length} scenes</div>
      </div>
    </div>
  );
}
