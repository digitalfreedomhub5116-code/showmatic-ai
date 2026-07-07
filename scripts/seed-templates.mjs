import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const templates = [
  {
    name: 'SaaS Intro',
    description: 'Introduce your product with a compelling hook, key features walkthrough, and a clear call-to-action.',
    category: 'Explainer',
    duration_seconds: 60,
    is_public: true,
    scenes: JSON.stringify([
      { id: 'scene-1', order: 0, type: 'hook', title: 'Hook', content: 'Start with the problem your audience faces', durationSeconds: 10, transition: 'fade' },
      { id: 'scene-2', order: 1, type: 'feature', title: 'Solution', content: 'Introduce your product as the solution', durationSeconds: 15, transition: 'slide' },
      { id: 'scene-3', order: 2, type: 'feature', title: 'Key Features', content: 'Highlight 2-3 key features with screenshots', durationSeconds: 20, transition: 'slide' },
      { id: 'scene-4', order: 3, type: 'social_proof', title: 'Social Proof', content: 'Show metrics, logos, or testimonials', durationSeconds: 5, transition: 'fade' },
      { id: 'scene-5', order: 4, type: 'cta', title: 'Call to Action', content: 'Tell viewers what to do next', durationSeconds: 10, transition: 'zoom' },
    ]),
    settings: JSON.stringify({ resolution: '1080p', aspectRatio: '16:9' }),
  },
  {
    name: 'Feature Demo',
    description: 'Walk through a key feature with product screenshots and clear narration.',
    category: 'Product',
    duration_seconds: 90,
    is_public: true,
    scenes: JSON.stringify([
      { id: 'scene-1', order: 0, type: 'hook', title: 'Context', content: 'Set the scene — what task is the user trying to do?', durationSeconds: 10, transition: 'fade' },
      { id: 'scene-2', order: 1, type: 'feature', title: 'Step 1', content: 'Show the first step with a screenshot', durationSeconds: 20, transition: 'slide' },
      { id: 'scene-3', order: 2, type: 'feature', title: 'Step 2', content: 'Show the second step with a screenshot', durationSeconds: 20, transition: 'slide' },
      { id: 'scene-4', order: 3, type: 'feature', title: 'Step 3', content: 'Show the result or outcome', durationSeconds: 20, transition: 'slide' },
      { id: 'scene-5', order: 4, type: 'cta', title: 'Try It', content: 'Invite the viewer to try it themselves', durationSeconds: 10, transition: 'zoom' },
    ]),
    settings: JSON.stringify({ resolution: '1080p', aspectRatio: '16:9' }),
  },
  {
    name: 'Launch Teaser',
    description: 'Build hype before a product launch with a fast-paced, high-energy teaser.',
    category: 'Marketing',
    duration_seconds: 30,
    is_public: true,
    scenes: JSON.stringify([
      { id: 'scene-1', order: 0, type: 'hook', title: 'Teaser', content: 'Something big is coming...', durationSeconds: 5, transition: 'zoom' },
      { id: 'scene-2', order: 1, type: 'feature', title: 'Glimpse', content: 'Quick glimpse of the product UI', durationSeconds: 8, transition: 'slide' },
      { id: 'scene-3', order: 2, type: 'feature', title: 'Highlight', content: 'One killer feature or benefit', durationSeconds: 8, transition: 'slide' },
      { id: 'scene-4', order: 3, type: 'cta', title: 'Save the Date', content: 'Launch date and signup link', durationSeconds: 9, transition: 'fade' },
    ]),
    settings: JSON.stringify({ resolution: '1080p', aspectRatio: '16:9' }),
  },
  {
    name: 'Onboarding',
    description: 'Guide new users through your product step by step with clear instructions.',
    category: 'Product',
    duration_seconds: 120,
    is_public: true,
    scenes: JSON.stringify([
      { id: 'scene-1', order: 0, type: 'hook', title: 'Welcome', content: 'Welcome new users and set expectations', durationSeconds: 10, transition: 'fade' },
      { id: 'scene-2', order: 1, type: 'feature', title: 'Getting Started', content: 'First thing to do after signing up', durationSeconds: 25, transition: 'slide' },
      { id: 'scene-3', order: 2, type: 'feature', title: 'Core Workflow', content: 'The main action they should take', durationSeconds: 30, transition: 'slide' },
      { id: 'scene-4', order: 3, type: 'feature', title: 'Pro Tips', content: 'Tips to get the most out of the product', durationSeconds: 25, transition: 'slide' },
      { id: 'scene-5', order: 4, type: 'feature', title: 'Next Steps', content: 'What to explore next', durationSeconds: 15, transition: 'slide' },
      { id: 'scene-6', order: 5, type: 'cta', title: 'Help & Support', content: 'Where to get help if stuck', durationSeconds: 15, transition: 'fade' },
    ]),
    settings: JSON.stringify({ resolution: '1080p', aspectRatio: '16:9' }),
  },
  {
    name: 'Paid Ad Creative',
    description: 'Short-form ad optimized for social media and paid channels. Grabs attention fast.',
    category: 'Marketing',
    duration_seconds: 15,
    is_public: true,
    scenes: JSON.stringify([
      { id: 'scene-1', order: 0, type: 'hook', title: 'Attention Hook', content: 'Bold statement or question that stops the scroll', durationSeconds: 3, transition: 'zoom' },
      { id: 'scene-2', order: 1, type: 'feature', title: 'Value Prop', content: 'One clear benefit + product visual', durationSeconds: 7, transition: 'slide' },
      { id: 'scene-3', order: 2, type: 'cta', title: 'CTA', content: 'Strong call to action with urgency', durationSeconds: 5, transition: 'fade' },
    ]),
    settings: JSON.stringify({ resolution: '1080p', aspectRatio: '9:16' }),
  },
  {
    name: 'Testimonial',
    description: 'Showcase customer success stories with quotes, metrics, and trust signals.',
    category: 'Social Proof',
    duration_seconds: 45,
    is_public: true,
    scenes: JSON.stringify([
      { id: 'scene-1', order: 0, type: 'hook', title: 'The Challenge', content: 'What problem did the customer have?', durationSeconds: 8, transition: 'fade' },
      { id: 'scene-2', order: 1, type: 'social_proof', title: 'The Quote', content: 'Customer testimonial in their own words', durationSeconds: 12, transition: 'slide' },
      { id: 'scene-3', order: 2, type: 'social_proof', title: 'The Results', content: 'Key metrics or outcomes achieved', durationSeconds: 12, transition: 'slide' },
      { id: 'scene-4', order: 3, type: 'cta', title: 'Your Turn', content: 'Invite viewers to get similar results', durationSeconds: 8, transition: 'zoom' },
    ]),
    settings: JSON.stringify({ resolution: '1080p', aspectRatio: '16:9' }),
  },
];

console.log('Seeding templates...');

// Clear existing templates first
await sql`DELETE FROM templates`;

for (const t of templates) {
  await sql`
    INSERT INTO templates (name, description, category, duration_seconds, is_public, scenes, settings)
    VALUES (${t.name}, ${t.description}, ${t.category}, ${t.duration_seconds}, ${t.is_public}, ${t.scenes}::jsonb, ${t.settings}::jsonb)
  `;
  console.log(`  ✓ ${t.name}`);
}

console.log(`\n✓ Seeded ${templates.length} templates!`);
await sql.end();
