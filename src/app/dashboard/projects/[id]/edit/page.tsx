'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { VideoPreviewPlayer } from '@/components/video/preview-player';
import type { VideoScene, VideoSettings } from '@/remotion';

const defaultSettings: VideoSettings = {
  brandColors: { primary: '#7C3AED', secondary: '#06B6D4', background: '#FFFFFF', text: '#0F172A' },
  fontFamily: 'Inter',
  productName: '',
};

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [scenes, setScenes] = useState<VideoScene[]>([]);
  const [settings, setSettings] = useState<VideoSettings>(defaultSettings);
  const [editingSceneIndex, setEditingSceneIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error('Failed to load project');
      const { project } = await res.json();
      setProject(project);
      setScenes(project.scenes || []);
      setSettings(project.settings || defaultSettings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes, settings, status: 'editing' }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function updateScene(index: number, updates: Partial<VideoScene>) {
    setScenes((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  }

  function moveScene(index: number, direction: 'up' | 'down') {
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newScenes.length) return;
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    newScenes.forEach((s, i) => (s.order = i));
    setScenes(newScenes);
  }

  function deleteScene(index: number) {
    setScenes((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
    setEditingSceneIndex(null);
  }

  function addScene() {
    const newScene: VideoScene = {
      id: `scene-${Date.now()}`,
      order: scenes.length,
      type: 'custom',
      title: 'New Scene',
      content: 'Add your content here',
      durationSeconds: 10,
      transition: 'fade',
    };
    setScenes([...scenes, newScene]);
    setEditingSceneIndex(scenes.length);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to project
          </button>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {project?.name || 'Video Editor'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => { handleSave(); router.push(`/dashboard/projects/${projectId}`); }}>
            Done Editing
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Preview */}
        <div>
          <Card>
            <CardContent className="p-4">
              <VideoPreviewPlayer
                scenes={scenes}
                settings={settings}
                className="aspect-video w-full"
              />
            </CardContent>
          </Card>

          {/* Scene Timeline */}
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Scenes ({scenes.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addScene}>+ Add Scene</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scenes.map((scene, i) => (
                  <div
                    key={scene.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      editingSceneIndex === i ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setEditingSceneIndex(i)}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{scene.title}</div>
                      <div className="text-xs text-muted-foreground">{scene.durationSeconds}s · {scene.type}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveScene(i, 'up'); }}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        disabled={i === 0}
                      >↑</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveScene(i, 'down'); }}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        disabled={i === scenes.length - 1}
                      >↓</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scene Editor Panel */}
        <div>
          {editingSceneIndex !== null && scenes[editingSceneIndex] && (
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Edit Scene {editingSceneIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={scenes[editingSceneIndex].title}
                    onChange={(e) => updateScene(editingSceneIndex, { title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={scenes[editingSceneIndex].type}
                    onChange={(e) => updateScene(editingSceneIndex, { type: e.target.value as any })}
                  >
                    <option value="hook">Hook</option>
                    <option value="feature">Feature</option>
                    <option value="social_proof">Social Proof</option>
                    <option value="cta">CTA</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Narration</Label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={scenes[editingSceneIndex].narration || ''}
                    onChange={(e) => updateScene(editingSceneIndex, { narration: e.target.value })}
                    placeholder="Voiceover text..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Visual Direction</Label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={scenes[editingSceneIndex].content}
                    onChange={(e) => updateScene(editingSceneIndex, { content: e.target.value })}
                    placeholder="What appears on screen..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration: {scenes[editingSceneIndex].durationSeconds}s</Label>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={scenes[editingSceneIndex].durationSeconds}
                    onChange={(e) => updateScene(editingSceneIndex, { durationSeconds: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transition</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={scenes[editingSceneIndex].transition || 'fade'}
                    onChange={(e) => updateScene(editingSceneIndex, { transition: e.target.value as any })}
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => deleteScene(editingSceneIndex)}
                >
                  Delete Scene
                </Button>
              </CardContent>
            </Card>
          )}

          {editingSceneIndex === null && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-3xl">🎬</div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Click a scene to edit its content, timing, and transitions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
