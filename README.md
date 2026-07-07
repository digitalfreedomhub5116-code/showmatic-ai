# Showmatic AI

Production-ready SaaS platform for creating explainer videos. Built with Next.js 14, Supabase, Drizzle ORM, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript, Server Components)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Database:** Supabase PostgreSQL + Drizzle ORM
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS + shadcn/ui-inspired components
- **AI:** Google Gemini (script generation)
- **Video:** Remotion (programmatic rendering)
- **Payments:** Lemon Squeezy (Merchant of Record)
- **Deployment:** Railway (Docker standalone build)

## Local Development

### Prerequisites

- Node.js 18+ (recommended: 20)
- npm or pnpm
- A Supabase project (free tier works for dev)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Fill in your Supabase credentials in .env.local
# Get them from: https://app.supabase.com → Project → Settings → API

# 4. Push the database schema
npm run db:push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Commands

```bash
npm run db:generate  # Generate migration files from schema changes
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema directly (dev only)
npm run db:studio    # Open Drizzle Studio GUI
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Login, signup, forgot password, callbacks
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── analytics/
│   │   ├── assets/
│   │   ├── billing/
│   │   ├── brand-kit/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── templates/
│   ├── globals.css
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Marketing landing page
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── ui/                # Reusable UI primitives
│   └── logo.tsx           # Brand logo component
├── lib/
│   ├── db/                # Drizzle ORM setup + schema
│   │   └── schema/        # Table definitions
│   ├── supabase/          # Supabase client (server + browser)
│   └── utils.ts           # Utility functions
└── middleware.ts          # Auth + route protection
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API key |
| `LEMONSQUEEZY_STORE_ID` | Lemon Squeezy store ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy webhook secret |
| `NEXT_PUBLIC_APP_URL` | App base URL |

## Deployment (Railway)

The app is configured for Docker standalone output. Railway will auto-detect the Next.js build.

```bash
# Build
npm run build

# Start production server
npm start
```
