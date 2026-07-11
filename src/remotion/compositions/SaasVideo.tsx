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
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationInFrames}>
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

const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, settings, index, totalScenes }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // --- Entrance / Exit ---
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // --- Animated background blobs ---
  const blob1X = interpolate(frame, [0, durationInFrames], [10, 30]);
  const blob1Y = interpolate(frame, [0, durationInFrames], [20, 40]);
  const blob2X = interpolate(frame, [0, durationInFrames], [70, 55]);
  const blob2Y = interpolate(frame, [0, durationInFrames], [60, 35]);

  // --- Text animations ---
  const titleSlide = spring({ fps, frame, config: { damping: 20, stiffness: 100 } });
  const titleY = interpolate(titleSlide, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSlide, [0, 1], [0, 1]);

  const subtitleDelay = 8;
  const subtitleSlide = spring({ fps, frame: Math.max(0, frame - subtitleDelay), config: { damping: 20, stiffness: 80 } });
  const subtitleY = interpolate(subtitleSlide, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleSlide, [0, 1], [0, 1]);

  const narrationDelay = 14;
  const narrationSlide = spring({ fps, frame: Math.max(0, frame - narrationDelay), config: { damping: 20, stiffness: 60 } });
  const narrationY = interpolate(narrationSlide, [0, 1], [20, 0]);
  const narrationOpacity = interpolate(narrationSlide, [0, 1], [0, 1]);

  // --- Accent line animation ---
  const lineWidth = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 30, stiffness: 120 } });
  const lineW = interpolate(lineWidth, [0, 1], [0, 80]);

  // --- Floating particles ---
  const particles = Array.from({ length: 6 }, (_, i) => ({
    x: (i * 17 + 10) % 100,
    y: interpolate(frame, [0, durationInFrames], [(i * 23) % 100, ((i * 23) + 30) % 100]),
    size: 3 + (i % 3) * 2,
    opacity: 0.15 + (i % 3) * 0.1,
  }));

  const sceneTypeColors: Record<string, string> = {
    hook: settings.brandColors.primary,
    feature: settings.brandColors.secondary || settings.brandColors.primary,
    social_proof: '#10b981',
    cta: settings.brandColors.primary,
    custom: settings.brandColors.primary,
  };

  const accentColor = sceneTypeColors[scene.type] || settings.brandColors.primary;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Animated gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: settings.brandColors.background,
        }}
      />

      {/* Moving gradient blobs */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          left: `${blob1X}%`,
          top: `${blob1Y}%`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}18, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          left: `${blob2X}%`,
          top: `${blob2Y}%`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${settings.brandColors.secondary || accentColor}12, transparent 70%)`,
          filter: 'blur(50px)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: accentColor,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Grid lines (subtle) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${settings.brandColors.text}05 1px, transparent 1px), linear-gradient(90deg, ${settings.brandColors.text}05 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '12%',
        }}
      >
        {/* Scene type badge */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 50,
              backgroundColor: `${accentColor}20`,
              border: `1px solid ${accentColor}40`,
              fontSize: 12,
              fontWeight: 700,
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontFamily: settings.fontFamily,
            }}
          >
            {scene.type.replace('_', ' ')}
          </span>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: lineW,
            height: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
            marginBottom: 20,
            opacity: 0.8,
          }}
        />

        {/* Title — kinetic typography */}
        <h1
          style={{
            fontSize: scene.type === 'hook' ? 48 : 38,
            fontWeight: 800,
            color: settings.brandColors.text,
            fontFamily: settings.fontFamily,
            lineHeight: 1.15,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            maxWidth: '90%',
          }}
        >
          {scene.title}
        </h1>

        {/* Subtitle / Visual Direction */}
        {scene.content && (
          <p
            style={{
              fontSize: 16,
              color: settings.brandColors.text,
              opacity: subtitleOpacity * 0.5,
              fontFamily: settings.fontFamily,
              lineHeight: 1.5,
              marginTop: 12,
              transform: `translateY(${subtitleY}px)`,
              maxWidth: '80%',
              fontStyle: 'italic',
            }}
          >
            {scene.content}
          </p>
        )}

        {/* Narration text */}
        {scene.narration && (
          <p
            style={{
              fontSize: 18,
              color: settings.brandColors.text,
              opacity: narrationOpacity * 0.85,
              fontFamily: settings.fontFamily,
              lineHeight: 1.6,
              marginTop: 20,
              transform: `translateY(${narrationY}px)`,
              maxWidth: '75%',
              borderLeft: `3px solid ${accentColor}60`,
              paddingLeft: 16,
            }}
          >
            &ldquo;{scene.narration}&rdquo;
          </p>
        )}

        {/* CTA Button for CTA scenes */}
        {scene.type === 'cta' && (
          <div
            style={{
              marginTop: 32,
              opacity: narrationOpacity,
              transform: `translateY(${narrationY}px) scale(${interpolate(narrationSlide, [0, 1], [0.9, 1])})`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 36px',
                backgroundColor: accentColor,
                color: '#ffffff',
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 700,
                fontFamily: settings.fontFamily,
                boxShadow: `0 8px 32px ${accentColor}40`,
              }}
            >
              {settings.productName ? `Try ${settings.productName}` : 'Get Started'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar — scene counter + progress */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 12%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: settings.brandColors.text,
            opacity: 0.4,
            fontFamily: settings.fontFamily,
            fontWeight: 600,
          }}
        >
          {String(index + 1).padStart(2, '0')} / {String(totalScenes).padStart(2, '0')}
        </span>

        {/* Progress bar */}
        <div
          style={{
            flex: 1,
            marginLeft: 16,
            height: 2,
            backgroundColor: `${settings.brandColors.text}15`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(frame / durationInFrames) * 100}%`,
              backgroundColor: accentColor,
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
