# Leucadia Sourdough

E-commerce and subscription platform for fresh-milled, organic sourdough bread delivery in North County San Diego.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS 4
- **Auth & Database**: Supabase (magic link auth, PostgreSQL)
- **Payments**: Stripe (subscriptions + one-time purchases)
- **Email**: SendGrid with React Email templates

## Features

- Product catalog with 3 bread varieties
- Shopping cart with one-time purchase checkout
- Monthly subscription signup ($75/month, 2 loaves/week)
- Customer portal for subscription management
- Magic link authentication
- Automated email notifications (order confirmation, subscription lifecycle)
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
STRIPE_PRICE_ID_BREAD_ONLY=
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
    create-one-time-checkout/ # One-time purchase
    create-portal-session/    # Stripe billing portal
    subscription/             # Subscription data
    webhooks/stripe/          # Stripe webhook handler
  components/                 # React components
  context/                    # Cart state (React Context)
  about/, cart/, checkout/,
  login/, portal/, shop/,
  subscribe/                  # Page routes
emails/                       # Email templates (React Email)
lib/
  stripe/                     # Stripe client/server config
  supabase/                   # Supabase client/server config
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/create-checkout-session` | POST | Create Stripe subscription checkout |
| `/api/create-one-time-checkout` | POST | Create one-time purchase checkout |
| `/api/create-portal-session` | POST | Open Stripe billing portal |
| `/api/subscription` | GET | Fetch subscription details |
| `/api/webhooks/stripe` | POST | Stripe webhook receiver |
