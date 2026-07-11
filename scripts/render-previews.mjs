/**
 * Render 5-second preview clips for each template.
 * 
 * Prerequisites:
 *   npm install --save-dev @remotion/bundler @remotion/renderer
 * 
 * Usage:
 *   node scripts/render-previews.mjs
 * 
 * This will:
 *   1. Bundle the Remotion composition
 *   2. Render a 5-second (150 frames @ 30fps) preview for each template
 *   3. Output WebM files to public/previews/
 * 
 * After running, commit the files in public/previews/ to git
 * and they'll be served statically.
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'previews');

// Template data (duplicated from src/lib/templates-data.ts for script use)
const templates = [
  {
    id: 'tpl-saas-intro',
    name: 'SaaS Intro',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Problem', content: 'Bold statement about the pain point', narration: 'Every day, teams waste hours on tasks that should take minutes.', durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Meet the Solution', content: 'Product logo + tagline reveal', narration: 'Introducing the smarter way to get things done.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-feature-demo',
    name: 'Feature Demo',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Task', content: 'Context about what the user wants to do', narration: "Need to set up automated reports? Here's how easy it is.", durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Step 1: Navigate', content: 'Screenshot of dashboard', narration: 'First, head to Settings and click on Automations.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-launch-teaser',
    name: 'Launch Teaser',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Coming Soon', content: 'Mysterious dark screen', narration: 'Something big is coming...', durationSeconds: 4, transition: 'zoom' },
      { id: 's2', order: 1, type: 'feature', title: 'A Glimpse', content: 'Quick flash of UI', narration: 'A completely new way to work.', durationSeconds: 6, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-onboarding',
    name: 'Onboarding Guide',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Welcome!', content: 'Welcome screen', narration: "Welcome! Let's get you set up in just 3 minutes.", durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Your Dashboard', content: 'Dashboard overview', narration: 'This is your home base. Everything you need is right here.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-paid-ad',
    name: 'Social Ad',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Stop Scrolling', content: 'Attention grab', narration: 'Still doing this manually?', durationSeconds: 3, transition: 'zoom' },
      { id: 's2', order: 1, type: 'feature', title: 'The Fix', content: 'Product demo', narration: "There's a better way. One click and it's done.", durationSeconds: 7, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-testimonial',
    name: 'Customer Story',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Challenge', content: 'Problem quote', narration: 'Before this tool, our team spent 20 hours a week on reporting.', durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'social_proof', title: 'The Results', content: 'Big metrics', narration: 'Ninety percent less time on reports. Three times more shipped.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-product-update',
    name: 'Product Update',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: "What's New", content: 'Feature announcement', narration: 'Big update: introducing Smart Suggestions.', durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'How It Works', content: 'Feature demo', narration: 'AI analyzes your workflow and suggests the next best action.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-explainer-60',
    name: 'Explainer',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Pain', content: 'Frustrated user', narration: 'Managing data across 10 tools is a nightmare.', durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'One Platform', content: 'Unified dashboard', narration: 'We bring everything into one place.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-comparison',
    name: 'Before & After',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Before', content: 'Old messy workflow', narration: 'This is how most teams handle invoices today. Painful.', durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'After', content: 'Clean automated', narration: 'And this is what it looks like now. Night and day.', durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-viral-hook',
    name: 'Viral Hook',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Hot Take', content: 'Bold statement', narration: "Your current tool is costing you $10K a month. Here's why.", durationSeconds: 4, transition: 'zoom' },
      { id: 's2', order: 1, type: 'feature', title: 'The Proof', content: 'Calculation', narration: 'Time wasted times hourly rate equals... yeah.', durationSeconds: 6, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-investor-pitch',
    name: 'Investor Pitch',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Market', content: '$50B market', narration: 'The workflow automation market is worth 50 billion dollars.', durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Our Solution', content: 'Product demo', narration: "We're building the operating system for modern teams.", durationSeconds: 5, transition: 'slide' },
    ],
  },
  {
    id: 'tpl-changelog',
    name: 'Changelog',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'This Month', content: 'What we shipped', narration: "Here's everything we shipped this month. It's a lot.", durationSeconds: 5, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Dark Mode', content: 'New feature', narration: 'Dark mode is finally here. Your eyes can thank us later.', durationSeconds: 5, transition: 'slide' },
    ],
  },
];

const defaultSettings = {
  brandColors: { primary: '#7C3AED', secondary: '#06B6D4', background: '#0f0f1a', text: '#f8fafc' },
  fontFamily: 'Inter',
  productName: 'Your Product',
};

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Bundling Remotion composition...');
  
  const bundleLocation = await bundle({
    entryPoint: path.join(rootDir, 'src', 'remotion', 'entry.tsx'),
    webpackOverride: (config) => config,
  });

  console.log(`Bundle ready at: ${bundleLocation}`);
  console.log(`Rendering ${templates.length} preview clips...\n`);

  for (const template of templates) {
    const outputPath = path.join(outputDir, `${template.id}.webm`);
    
    if (fs.existsSync(outputPath)) {
      console.log(`  ⊘ ${template.name} (already exists, skipping)`);
      continue;
    }

    console.log(`  ⏳ Rendering ${template.name}...`);

    const fps = 30;
    const durationInFrames = template.scenes.reduce((acc, s) => acc + s.durationSeconds * fps, 0);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'SaasVideoPreview',
      inputProps: {
        scenes: template.scenes,
        settings: defaultSettings,
      },
    });

    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
        width: 720,
        height: 960,
      },
      serveUrl: bundleLocation,
      codec: 'vp8',
      outputLocation: outputPath,
      inputProps: {
        scenes: template.scenes,
        settings: defaultSettings,
      },
    });

    console.log(`  ✓ ${template.name} → ${outputPath}`);
  }

  console.log('\n✓ All previews rendered!');
  console.log('Commit the files in public/previews/ to your repo.');
}

main().catch((err) => {
  console.error('Render failed:', err);
  process.exit(1);
});
