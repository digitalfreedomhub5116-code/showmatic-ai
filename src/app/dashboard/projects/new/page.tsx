'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';

type VideoType = 'explainer' | 'feature_demo' | 'launch_teaser' | 'onboarding' | 'paid_ad' | 'testimonial';
type Tone = 'professional' | 'casual' | 'energetic' | 'minimal';

const videoTypes: { value: VideoType; label: string; description: string }[] = [
  { value: 'explainer', label: 'Product Explainer', description: 'Introduce your product with hook + features + CTA' },
  { value: 'feature_demo', label: 'Feature Demo', description: 'Walk through a specific feature step-by-step' },
  { value: 'launch_teaser', label: 'Launch Teaser', description: 'Build hype before a product launch' },
  { value: 'onboarding', label: 'Onboarding', description: 'Guide new users through your product' },
  { value: 'paid_ad', label: 'Paid Ad', description: 'Short-form ad for social media' },
  { value: 'testimonial', label: 'Testimonial', description: 'Showcase customer success stories' },
];

const tones: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'minimal', label: 'Minimal' },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<'setup' | 'generating' | 'review'>('setup');
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [projectName, setProjectName] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [videoType, setVideoType] = useState<VideoType>('explainer');
  const [tone, setTone] = useState<Tone>('professional');
  const [duration, setDuration] = useState(60);

  // Generated content
  const [generatedScript, setGeneratedScript] = useState<any>(null);

  async function handleGenerate() {
    setError(null);
    setStep('generating');

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          targetAudience,
          videoType,
          tone,
          durationSeconds: duration,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate script');
      }

      const { result } = await res.json();
      setGeneratedScript(result);
      setStep('review');
    } catch (err: any) {
      setError(err.message);
      setStep('setup');
    }
  }

  async function handleCreateProject() {
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName || `${productName} - ${videoTypes.find(v => v.value === videoType)?.label}`,
          description: productDescription.slice(0, 200),
        }),
      });

      if (!res.ok) throw new Error('Failed to create project');

      const { project } = await res.json();

      // Update project with generated script and scenes
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: generatedScript.script,
          scenes: generatedScript.scenes,
          status: 'scripting',
        }),
      });

      router.push(`/dashboard/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Video</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your product and let AI generate a video script for you.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Step 1: Setup */}
      {step === 'setup' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About Your Product</CardTitle>
              <CardDescription>Tell us about what you&apos;re making a video for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name (optional)</Label>
                <Input
                  id="project-name"
                  placeholder="e.g. Q3 Product Launch Video"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  placeholder="e.g. Showmatic AI"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Product Description *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe your product, its key features, and the problem it solves..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Input
                  id="audience"
                  placeholder="e.g. SaaS founders and marketing teams"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Video Type</CardTitle>
              <CardDescription>What kind of video are you making?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {videoTypes.map((vt) => (
                  <button
                    key={vt.value}
                    type="button"
                    onClick={() => setVideoType(vt.value)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      videoType === vt.value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'hover:border-foreground/20 hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{vt.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{vt.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Style & Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        tone === t.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration: {duration}s</Label>
                <input
                  id="duration"
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15s</span>
                  <span>60s</span>
                  <span>120s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={!productName || !productDescription || !targetAudience}
          >
            Generate Script with AI
          </Button>
        </div>
      )}

      {/* Step 2: Generating */}
      {step === 'generating' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <h2 className="mt-6 text-lg font-semibold">Generating your script...</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              AI is crafting a {duration}s {videoTypes.find(v => v.value === videoType)?.label.toLowerCase()} script for {productName}.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 'review' && generatedScript && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generated Script</CardTitle>
              <CardDescription>Review and edit the AI-generated script before creating your project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {generatedScript.script}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenes ({generatedScript.scenes?.length || 0})</CardTitle>
              <CardDescription>Your video broken into individual scenes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedScript.scenes?.map((scene: any, i: number) => (
                  <div key={scene.id || i} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </div>
                        <div className="font-medium text-sm">{scene.title}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-muted px-2 py-0.5 text-xs capitalize">{scene.type}</span>
                        <span className="text-xs text-muted-foreground">{scene.durationSeconds}s</span>
                      </div>
                    </div>
                    {scene.narration && (
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        &ldquo;{scene.narration}&rdquo;
                      </p>
                    )}
                    {scene.content && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Visual: {scene.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
              Start Over
            </Button>
            <Button variant="outline" onClick={handleGenerate} className="flex-1">
              Regenerate
            </Button>
            <Button onClick={handleCreateProject} className="flex-1">
              Create Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
