'use client';

import { Player } from '@remotion/player';
import { SaasVideo, type VideoScene, type VideoSettings } from '@/remotion';

interface VideoPreviewPlayerProps {
  scenes: VideoScene[];
  settings: VideoSettings;
  className?: string;
}

export function VideoPreviewPlayer({ scenes, settings, className }: VideoPreviewPlayerProps) {
  // Calculate total duration in frames (30fps)
  const fps = 30;
  const totalDurationInFrames = scenes.reduce(
    (acc, scene) => acc + scene.durationSeconds * fps,
    0
  );

  if (scenes.length === 0 || totalDurationInFrames === 0) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-slate-900 text-white ${className}`}>
        <p className="text-sm text-slate-400">No scenes to preview</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Player
        component={SaasVideo}
        inputProps={{ scenes, settings }}
        durationInFrames={totalDurationInFrames}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={fps}
        style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
        controls
        autoPlay={false}
      />
    </div>
  );
}
