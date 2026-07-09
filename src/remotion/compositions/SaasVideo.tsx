import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

export interface VideoScene {
  id: string;
  order: number;
  type: 'hook' | 'feature' | 'social_proof' | 'cta' | 'custom';
  title: string;
  content: string;
  narration?: string;
  durationSeconds: number;
  transition?: 'fade' | 'slide' | 'zoom' | 'none';
  media?: { type: string; url: string; alt?: string };
}

export interface VideoSettings {
  brandColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fontFamily: string;
  productName: string;
}

interface SaasVideoProps {
  scenes: VideoScene[];
  settings: VideoSettings;
}

export const SaasVideo: React.FC<SaasVideoProps> = ({ scenes, settings }) => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: settings.brandColors.background }}>
      {scenes.map((scene, index) => {
        const startFrame = currentFrame;
        const durationInFrames = scene.durationSeconds * fps;
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              settings={settings}
              index={index}
              totalScenes={scenes.length}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

interface SceneRendererProps {
  scene: VideoScene;
  settings: VideoSettings;
  index: number;
  totalScenes: number;
}

const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, settings, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animation
  const entrance = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Exit animation (fade out in last 10 frames)
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = Math.min(entrance, exit);

  // Slide offset based on transition type
  const slideOffset =
    scene.transition === 'slide'
      ? interpolate(frame, [0, 20], [60, 0], { extrapolateRight: 'clamp' })
      : 0;

  // Scale for zoom transition
  const scale =
    scene.transition === 'zoom'
      ? interpolate(frame, [0, 20], [0.85, 1], { extrapolateRight: 'clamp' })
      : 1;

  const sceneStyle = getSceneStyle(scene.type, settings);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${slideOffset}px) scale(${scale})`,
        ...sceneStyle.container,
      }}
    >
      {/* Background gradient for different scene types */}
      <div style={sceneStyle.background} />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        {/* Scene type label */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: settings.brandColors.primary,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 16,
            opacity: 0.8,
          }}
        >
          {scene.type.replace('_', ' ')}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: scene.type === 'hook' ? 56 : 44,
            fontWeight: 800,
            color: settings.brandColors.text,
            fontFamily: settings.fontFamily,
            lineHeight: 1.2,
            margin: 0,
            maxWidth: '80%',
          }}
        >
          {scene.title}
        </h1>

        {/* Narration / Content */}
        {scene.narration && (
          <p
            style={{
              fontSize: 22,
              color: settings.brandColors.text,
              opacity: 0.7,
              fontFamily: settings.fontFamily,
              lineHeight: 1.6,
              marginTop: 24,
              maxWidth: '70%',
            }}
          >
            {scene.narration}
          </p>
        )}

        {/* Visual direction hint */}
        {scene.content && !scene.narration && (
          <p
            style={{
              fontSize: 20,
              color: settings.brandColors.text,
              opacity: 0.6,
              fontFamily: settings.fontFamily,
              lineHeight: 1.5,
              marginTop: 20,
              maxWidth: '65%',
            }}
          >
            {scene.content}
          </p>
        )}

        {/* CTA button for CTA scenes */}
        {scene.type === 'cta' && (
          <div
            style={{
              marginTop: 40,
              padding: '16px 48px',
              backgroundColor: settings.brandColors.primary,
              color: '#ffffff',
              borderRadius: 50,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {settings.productName ? `Try ${settings.productName}` : 'Get Started'}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: `${settings.brandColors.primary}22`,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / durationInFrames) * 100}%`,
            backgroundColor: settings.brandColors.primary,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

function getSceneStyle(type: string, settings: VideoSettings) {
  const baseContainer: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
  };

  const backgrounds: Record<string, React.CSSProperties> = {
    hook: {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at top left, ${settings.brandColors.primary}15, transparent 50%), radial-gradient(circle at bottom right, ${settings.brandColors.secondary || settings.brandColors.primary}10, transparent 50%)`,
    },
    feature: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(135deg, ${settings.brandColors.background}, ${settings.brandColors.primary}08)`,
    },
    social_proof: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, ${settings.brandColors.primary}05, ${settings.brandColors.background})`,
    },
    cta: {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at center, ${settings.brandColors.primary}12, ${settings.brandColors.background})`,
    },
    custom: {
      position: 'absolute',
      inset: 0,
      background: settings.brandColors.background,
    },
  };

  return {
    container: baseContainer,
    background: backgrounds[type] || backgrounds.custom,
  };
}
