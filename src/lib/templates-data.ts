/**
 * Hardcoded templates data — displayed without DB dependency.
 * These are always available regardless of database connectivity.
 */

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  durationSeconds: number;
  gradient: string;
  scenes: TemplateScene[];
}

export interface TemplateScene {
  id: string;
  order: number;
  type: 'hook' | 'feature' | 'social_proof' | 'cta' | 'custom';
  title: string;
  content: string;
  narration: string;
  durationSeconds: number;
  transition: 'fade' | 'slide' | 'zoom' | 'none';
}

export const TEMPLATES: TemplateData[] = [
  {
    id: 'tpl-saas-intro',
    name: 'SaaS Intro',
    description: 'Introduce your product with a compelling hook, key features, and CTA.',
    category: 'SaaS',
    durationSeconds: 60,
    gradient: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #7c3aed 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Problem', content: 'Bold statement about the pain point', narration: 'Every day, teams waste hours on tasks that should take minutes.', durationSeconds: 10, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Meet the Solution', content: 'Product logo + tagline reveal', narration: 'Introducing [Product] — the smarter way to get things done.', durationSeconds: 12, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'Key Features', content: 'UI screenshot with feature highlights', narration: 'Automate workflows, collaborate in real-time, and ship faster.', durationSeconds: 18, transition: 'slide' },
      { id: 's4', order: 3, type: 'social_proof', title: 'Trusted By', content: 'Customer logos and metrics', narration: 'Trusted by over 5,000 teams worldwide.', durationSeconds: 8, transition: 'fade' },
      { id: 's5', order: 4, type: 'cta', title: 'Get Started', content: 'CTA button with URL', narration: 'Start your free trial today. No credit card required.', durationSeconds: 12, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-feature-demo',
    name: 'Feature Demo',
    description: 'Walk through a specific feature with step-by-step narration.',
    category: 'Product Demo',
    durationSeconds: 90,
    gradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 40%, #238636 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Task', content: 'Context about what the user wants to do', narration: 'Need to set up automated reports? Here\'s how easy it is.', durationSeconds: 10, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Step 1: Navigate', content: 'Screenshot of dashboard', narration: 'First, head to Settings and click on Automations.', durationSeconds: 20, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'Step 2: Configure', content: 'Screenshot of configuration panel', narration: 'Choose your trigger, set the schedule, and pick your template.', durationSeconds: 25, transition: 'slide' },
      { id: 's4', order: 3, type: 'feature', title: 'Step 3: Activate', content: 'Screenshot showing success state', narration: 'Hit save, and you\'re done. Reports will land in your inbox automatically.', durationSeconds: 20, transition: 'slide' },
      { id: 's5', order: 4, type: 'cta', title: 'Try It Now', content: 'CTA with product link', narration: 'Try it yourself — takes less than 2 minutes to set up.', durationSeconds: 15, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-launch-teaser',
    name: 'Launch Teaser',
    description: 'Build hype before a product launch with fast pacing and mystery.',
    category: 'Launch Teaser',
    durationSeconds: 30,
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Coming Soon', content: 'Mysterious dark screen with particles', narration: 'Something big is coming...', durationSeconds: 5, transition: 'zoom' },
      { id: 's2', order: 1, type: 'feature', title: 'A Glimpse', content: 'Quick flash of UI elements', narration: 'A completely new way to work.', durationSeconds: 8, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'The Promise', content: '10x faster text animation', narration: 'Ten times faster. Zero compromise.', durationSeconds: 8, transition: 'slide' },
      { id: 's4', order: 3, type: 'cta', title: 'Save the Date', content: 'Launch date with countdown', narration: 'Launching March 15. Join the waitlist.', durationSeconds: 9, transition: 'fade' },
    ],
  },
  {
    id: 'tpl-onboarding',
    name: 'Onboarding Guide',
    description: 'Welcome new users and guide them through your product step by step.',
    category: 'Onboarding',
    durationSeconds: 120,
    gradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Welcome!', content: 'Friendly welcome screen with product logo', narration: 'Welcome to [Product]! Let\'s get you set up in just 3 minutes.', durationSeconds: 12, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Your Dashboard', content: 'Overview of main dashboard', narration: 'This is your home base. Everything you need is right here.', durationSeconds: 25, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'Create Your First', content: 'Step-by-step creation flow', narration: 'Click the plus button to create your first project. Name it and go.', durationSeconds: 30, transition: 'slide' },
      { id: 's4', order: 3, type: 'feature', title: 'Pro Tips', content: 'Keyboard shortcuts and tips', narration: 'Pro tip: use Cmd+K to quickly search anything.', durationSeconds: 25, transition: 'slide' },
      { id: 's5', order: 4, type: 'feature', title: 'Get Help', content: 'Support channels', narration: 'Stuck? Our docs and support team are always here to help.', durationSeconds: 15, transition: 'slide' },
      { id: 's6', order: 5, type: 'cta', title: 'You\'re Ready!', content: 'Celebration animation', narration: 'That\'s it! You\'re all set. Start building something amazing.', durationSeconds: 13, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-paid-ad',
    name: 'Social Ad (15s)',
    description: 'Short-form ad optimized for Instagram, TikTok, and YouTube Shorts.',
    category: 'Paid Ad',
    durationSeconds: 15,
    gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Stop Scrolling', content: 'Bold text that grabs attention', narration: 'Still doing this manually?', durationSeconds: 3, transition: 'zoom' },
      { id: 's2', order: 1, type: 'feature', title: 'The Fix', content: 'Product in action — quick demo', narration: 'There\'s a better way. One click and it\'s done.', durationSeconds: 7, transition: 'slide' },
      { id: 's3', order: 2, type: 'cta', title: 'Try Free', content: 'Strong CTA with urgency', narration: 'Try it free. Link in bio.', durationSeconds: 5, transition: 'fade' },
    ],
  },
  {
    id: 'tpl-testimonial',
    name: 'Customer Story',
    description: 'Showcase a customer success story with quotes and metrics.',
    category: 'SaaS',
    durationSeconds: 45,
    gradient: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Challenge', content: 'Customer quote about their problem', narration: 'Before [Product], our team spent 20 hours a week on reporting.', durationSeconds: 10, transition: 'fade' },
      { id: 's2', order: 1, type: 'social_proof', title: 'The Testimonial', content: 'Customer photo + quote card', narration: '"[Product] cut that down to 2 hours. It\'s a game-changer." — Sarah, VP Engineering', durationSeconds: 12, transition: 'slide' },
      { id: 's3', order: 2, type: 'social_proof', title: 'The Results', content: 'Big metrics: 90% time saved, 3x throughput', narration: 'Ninety percent less time on reports. Three times more shipped.', durationSeconds: 12, transition: 'slide' },
      { id: 's4', order: 3, type: 'cta', title: 'Your Turn', content: 'CTA with free trial offer', narration: 'Ready for results like these? Start your free trial today.', durationSeconds: 11, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-product-update',
    name: 'Product Update',
    description: 'Announce a new feature or product update to your users.',
    category: 'SaaS',
    durationSeconds: 45,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'What\'s New', content: 'New badge + feature name', narration: 'Big update: introducing Smart Suggestions.', durationSeconds: 8, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'How It Works', content: 'Feature in action screenshot', narration: 'AI analyzes your workflow and suggests the next best action.', durationSeconds: 15, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'The Impact', content: 'Before/after comparison', narration: 'Users are completing tasks 40% faster with suggestions enabled.', durationSeconds: 12, transition: 'slide' },
      { id: 's4', order: 3, type: 'cta', title: 'Try It Now', content: 'Enable in settings CTA', narration: 'Available now in your dashboard. Enable it in Settings.', durationSeconds: 10, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-explainer-60',
    name: 'Explainer (60s)',
    description: 'Classic 60-second explainer — problem, solution, features, proof, CTA.',
    category: 'SaaS',
    durationSeconds: 60,
    gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Pain', content: 'Frustrated user illustration', narration: 'Managing data across 10 tools is a nightmare.', durationSeconds: 10, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'One Platform', content: 'Product overview — unified dashboard', narration: '[Product] brings everything into one place.', durationSeconds: 12, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'Smart Sync', content: 'Data flowing between tools animation', narration: 'Connect your tools in one click. Data syncs automatically.', durationSeconds: 12, transition: 'slide' },
      { id: 's4', order: 3, type: 'feature', title: 'Real-Time', content: 'Live dashboard updating', narration: 'See changes in real-time. No more stale data.', durationSeconds: 10, transition: 'slide' },
      { id: 's5', order: 4, type: 'social_proof', title: 'Join 10K Teams', content: 'Social proof bar', narration: 'Join 10,000 teams who\'ve simplified their stack.', durationSeconds: 6, transition: 'fade' },
      { id: 's6', order: 5, type: 'cta', title: 'Start Free', content: 'CTA with pricing', narration: 'Start free. Upgrade when you\'re ready.', durationSeconds: 10, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-comparison',
    name: 'Before & After',
    description: 'Show the transformation — life before vs. after your product.',
    category: 'Product Demo',
    durationSeconds: 45,
    gradient: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Before', content: 'Messy workflow / old way', narration: 'This is how most teams handle invoices today. Painful.', durationSeconds: 10, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'After', content: 'Clean, automated workflow', narration: 'And this is what it looks like with [Product]. Night and day.', durationSeconds: 12, transition: 'slide' },
      { id: 's3', order: 2, type: 'social_proof', title: 'The Numbers', content: '5x faster, 0 errors, 100% automated', narration: 'Five times faster. Zero errors. Fully automated.', durationSeconds: 12, transition: 'slide' },
      { id: 's4', order: 3, type: 'cta', title: 'Switch Today', content: 'Migration is easy CTA', narration: 'Switch in 5 minutes. We even migrate your data for free.', durationSeconds: 11, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-viral-hook',
    name: 'Viral Hook (9:16)',
    description: 'Vertical short-form content designed for maximum engagement.',
    category: 'Paid Ad',
    durationSeconds: 20,
    gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'Hot Take', content: 'Bold controversial statement', narration: 'Your current tool is costing you $10K a month. Here\'s why.', durationSeconds: 4, transition: 'zoom' },
      { id: 's2', order: 1, type: 'feature', title: 'The Proof', content: 'Quick calculation breakdown', narration: 'Time wasted times hourly rate equals... yeah.', durationSeconds: 8, transition: 'slide' },
      { id: 's3', order: 2, type: 'cta', title: 'The Fix', content: 'Product reveal + link', narration: 'This tool pays for itself in day one. Link below.', durationSeconds: 8, transition: 'fade' },
    ],
  },
  {
    id: 'tpl-investor-pitch',
    name: 'Investor Pitch',
    description: 'Quick pitch deck style video for fundraising or partnerships.',
    category: 'SaaS',
    durationSeconds: 90,
    gradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #533483 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'The Market', content: '$50B market size headline', narration: 'The workflow automation market is worth 50 billion dollars.', durationSeconds: 10, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Our Solution', content: 'Product demo in action', narration: 'We\'re building the operating system for modern teams.', durationSeconds: 20, transition: 'slide' },
      { id: 's3', order: 2, type: 'social_proof', title: 'Traction', content: 'Growth chart going up', narration: '3x revenue growth. 500 paying customers. 95% retention.', durationSeconds: 15, transition: 'slide' },
      { id: 's4', order: 3, type: 'feature', title: 'The Team', content: 'Founder photos + credentials', narration: 'Built by ex-Stripe and ex-Notion engineers.', durationSeconds: 15, transition: 'slide' },
      { id: 's5', order: 4, type: 'feature', title: 'The Ask', content: 'Raising $5M Series A', narration: 'We\'re raising 5 million to scale go-to-market.', durationSeconds: 15, transition: 'slide' },
      { id: 's6', order: 5, type: 'cta', title: 'Let\'s Talk', content: 'Calendar link', narration: 'Let\'s chat. Book 15 minutes with our CEO.', durationSeconds: 15, transition: 'zoom' },
    ],
  },
  {
    id: 'tpl-changelog',
    name: 'Changelog Video',
    description: 'Monthly changelog roundup — show what you shipped.',
    category: 'Product Demo',
    durationSeconds: 60,
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    scenes: [
      { id: 's1', order: 0, type: 'hook', title: 'This Month', content: 'Month name + "What we shipped"', narration: 'Here\'s everything we shipped in July. It\'s a lot.', durationSeconds: 8, transition: 'fade' },
      { id: 's2', order: 1, type: 'feature', title: 'Feature 1', content: 'New feature screenshot', narration: 'Dark mode is finally here. Your eyes can thank us later.', durationSeconds: 12, transition: 'slide' },
      { id: 's3', order: 2, type: 'feature', title: 'Feature 2', content: 'API improvements', narration: 'API v2 is live — 3x faster with better error handling.', durationSeconds: 12, transition: 'slide' },
      { id: 's4', order: 3, type: 'feature', title: 'Feature 3', content: 'Integration screenshot', narration: 'Plus 12 new integrations including Slack, Notion, and Linear.', durationSeconds: 12, transition: 'slide' },
      { id: 's5', order: 4, type: 'cta', title: 'What\'s Next', content: 'Roadmap teaser', narration: 'Next month: AI features. Stay tuned.', durationSeconds: 10, transition: 'zoom' },
    ],
  },
];

export const TEMPLATE_CATEGORIES = ['All', 'SaaS', 'Product Demo', 'Launch Teaser', 'Onboarding', 'Paid Ad'];
