# Leucadia Sourdough

Subscription platform for fresh-milled, organic sourdough bread delivery in North County San Diego.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS 4
- **Auth & Database**: Supabase (magic link auth, PostgreSQL)
- **Payments**: Stripe (subscriptions)
- **Email**: SendGrid with React Email templates

## Features

- Two subscription tiers: 1 Loaf/Week ($38/4wk) and 2 Loaves/Week ($68/4wk)
- Customer portal for subscription management
- Magic link authentication
- Automated email notifications (subscription lifecycle)
- Stripe webhook handling for payment events
- Geo-targeted local landing pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID_ONE_LOAF=
STRIPE_PRICE_ID_TWO_LOAF=
STRIPE_WEBHOOK_SECRET=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Stripe Webhooks (Local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Project Structure

```
app/
  api/                        # API routes
    create-checkout-session/  # Subscription checkout
    create-portal-session/    # Stripe billing portal
    subscription/             # Subscription data
    webhooks/stripe/          # Stripe webhook handler
  about/, login/, portal/,
  subscribe/, local/          # Page routes
emails/                       # Email templates (React Email)
lib/
  stripe/                     # Stripe client/server config
  supabase/                   # Supabase client/server config
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/create-checkout-session` | POST | Create Stripe subscription checkout |
| `/api/create-portal-session` | POST | Open Stripe billing portal |
| `/api/subscription` | GET | Fetch subscription details |
| `/api/webhooks/stripe` | POST | Stripe webhook receiver |
