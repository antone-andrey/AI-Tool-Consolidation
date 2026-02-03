# AI Spend & ROI OS (MVP Bootstrap)

This repository contains the MVP for the **AI Spend & ROI OS** SaaS. The project uses Next.js App Router, TailwindCSS, Prisma, Auth.js (NextAuth), and Stripe to deliver AI spend tracking, interaction logging, and subscription management.

## Stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **TailwindCSS + shadcn/ui**
- **PostgreSQL + Prisma**
- **Auth.js (NextAuth)**
- **Stripe subscriptions**

## Prerequisites

- Node.js 18+
- npm (or your preferred package manager)
- PostgreSQL instance (local or managed)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

> If you are in a restricted environment, ensure your npm registry is set to an allowlisted/internal registry before installing:
>
> ```bash
> npm config set registry https://your-internal-registry.example.com
> ```

### 2) Configure environment variables

Create a `.env` file (see `.env.example`):

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="replace-me"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="replace-me"
GOOGLE_CLIENT_SECRET="replace-me"
STRIPE_SECRET_KEY="sk_test_replace"
STRIPE_WEBHOOK_SECRET="whsec_replace"
STRIPE_PRICE_ID="price_replace"
```

### 3) Generate Prisma client and migrate

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4) (Optional) Seed demo data

```bash
npm run prisma:seed
```

Demo login: `demo@aispendos.com` / `password123`

### 5) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Scripts

- `npm run dev` — Start the Next.js dev server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint
- `npm test` — Run unit tests (Vitest)
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:migrate` — Run Prisma migrations
- `npm run prisma:studio` — Open Prisma Studio
- `npm run prisma:seed` — Seed demo data

## Stripe setup notes

1. Create a Stripe product with a **monthly recurring** price.
2. Copy the price ID into `STRIPE_PRICE_ID`.
3. Create a webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

### Test webhooks locally

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then trigger a test checkout in the app.

## Project Structure

```
.
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── lib/
│       └── utils.ts
├── components.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## Notes

This MVP includes authentication, dashboard insights, tools/spend tracking, interaction logging, and Stripe billing with a free-tier limit.
