import { registerRoot, Composition } from 'remotion';
import { SaasVideo } from './compositions/SaasVideo';
import type { VideoScene, VideoSettings } from './compositions/SaasVideo';

const defaultScenes: VideoScene[] = [
  { id: 's1', order: 0, type: 'hook', title: 'Preview', content: 'Template preview', durationSeconds: 5, transition: 'fade' },
];

const defaultSettings: VideoSettings = {
  brandColors: { primary: '#7C3AED', secondary: '#06B6D4', background: '#0f0f1a', text: '#f8fafc' },
  fontFamily: 'Inter',
  productName: 'Your Product',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SaasVideoPreview"
        component={SaasVideo as any}
        durationInFrames={300}
        fps={30}
        width={720}
        height={960}
        defaultProps={{
          scenes: defaultScenes,
          settings: defaultSettings,
        }}
      />
      <Composition
        id="SaasVideo"
        component={SaasVideo as any}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: defaultScenes,
          settings: defaultSettings,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
