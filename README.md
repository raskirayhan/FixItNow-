# FixItNow

<p align="center">
  <strong>A full-stack home-services marketplace for discovering, booking, and managing local service work.</strong>
</p>

<p align="center">
  <a href="https://github.com/raskirayhan/FixItNow-/actions/workflows/ci.yml"><img src="https://github.com/raskirayhan/FixItNow-/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white" alt="Node.js 20 or newer">
  <img src="https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
</p>

FixItNow is a portfolio-grade marketplace application with separate React and Express packages. Customers can browse services, book technicians, track booking status, manage a wallet, and submit reviews. Technicians can publish services and manage their workload, while administrators have access to operational dashboards and moderation endpoints.

> **Project status:** Active development. The core user journeys, API surface, database model, API documentation, and deployment blueprint are present. Production hardening and automated test coverage are still in progress; see [Known Issues](#known-issues-and-limitations) and the [Roadmap](#roadmap).

## Contents

- [Highlights](#highlights)
- [Project Status](#project-status)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Repository Layout](#repository-layout)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [API Reference](#api-reference)
- [Security](#security)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Known Issues and Limitations](#known-issues-and-limitations)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Highlights

- Role-aware marketplace flows for customers, technicians, and administrators.
- Searchable and filterable service catalog with categories, technician profiles, and reviews.
- Booking lifecycle with role-protected status transitions.
- Stripe PaymentIntent creation and webhook handling on the backend.
- Wallet and transaction history modeled in PostgreSQL through Prisma.
- JWT authentication with bcrypt password hashing, Zod request validation, and role middleware.
- Interactive Swagger UI and an importable Postman collection for API exploration.
- Responsive React UI with TanStack Query, React Router, Tailwind CSS, Radix primitives, and Framer Motion.
- Render blueprint for the backend and CI that validates the independent frontend and backend packages.

## Project Status

| Area | Current state |
| --- | --- |
| Customer experience | Browse services, view technicians, book services, manage profile, view notifications, and submit reviews. |
| Technician experience | Maintain a technician profile, create services, and manage technician bookings. |
| Admin experience | Dashboard statistics, user management, booking/category views, and ban/unban operations. |
| Backend API | Express 5 API with Prisma/PostgreSQL persistence, JWT auth, role checks, validation, and Swagger documentation. |
| Payments | Stripe server-side PaymentIntent and webhook paths are implemented; some frontend payment options remain demonstrative. |
| Automated tests | No test script is currently defined in either package. CI currently performs lint/build validation. |
| Deployment | `render.yaml` provisions the backend. The frontend is intended for a separate static hosting deployment. |

## Architecture

```text
                           +----------------------+
                           |  PostgreSQL          |
                           |  Prisma data layer   |
                           +----------^-----------+
                                      |
+------------------+       +---------+----------+       +----------------+
| React + Vite SPA | ----> | Express 5 API      | ----> | Stripe API      |
| Axios + Query    | /api  | auth, routes,      |       | PaymentIntent   |
| Router + Tailwind|       | controllers, Zod   | <---- | webhook events  |
+--------+---------+       +---------+----------+       +----------------+
         |                           |
         | Vite dev proxy            +--> Swagger UI: /api/docs or /api-docs
         +--> static production host
```

### Request flow

1. The Vite development server proxies `/api` requests to `http://localhost:5000`. In production, `VITE_API_URL` points the client at the deployed backend.
2. Express applies Helmet, Morgan, cookie parsing, global rate limiting, CORS, and JSON parsing. The Stripe webhook route receives the raw request body for signature verification.
3. Routers apply JWT authentication and role checks where required, then Zod middleware validates request payloads before controllers run.
4. Controllers use Prisma to read and write the PostgreSQL schema. Successful responses generally use a `{ success, message?, data }` envelope.
5. Authentication returns a JWT with a seven-day expiry. The current SPA stores that token in browser `localStorage`; this is documented as a hardening item below.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, React Router 7, TanStack Query, Axios, Tailwind CSS 4, Radix UI, Framer Motion, React Hook Form, Zod |
| Backend | Node.js, Express 5, TypeScript, Prisma 5, PostgreSQL, Zod |
| Authentication | JWT, bcryptjs, role-based middleware |
| Payments | Stripe server SDK, PaymentIntent flow, signed webhook processing |
| API quality and security | Swagger/OpenAPI, Helmet, CORS allowlist, express-rate-limit, Morgan |
| Tooling | npm lockfiles per package, Oxlint for the frontend, Render blueprint, GitHub Actions, Dependabot |

## Repository Layout

```text
FixItNow/
├── backend/                         # Express API package
│   ├── prisma/
│   │   ├── schema.prisma             # PostgreSQL schema (11 models)
│   │   └── seed.ts                   # Local/demo data seeder
│   ├── src/
│   │   ├── config/                   # Database, Stripe, and Swagger setup
│   │   ├── controllers/              # Request handlers and business operations
│   │   ├── middlewares/              # Auth, validation, and error handling
│   │   ├── routes/                   # Auth, services, bookings, payments, etc.
│   │   ├── schemas/                  # Zod request schemas
│   │   ├── app.ts                    # Express middleware and route assembly
│   │   └── server.ts                 # HTTP server entry point
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── frontend/                        # React SPA package
│   ├── src/
│   │   ├── components/               # Layout, shared, and Radix-based UI
│   │   ├── context/                  # Authentication and theme state
│   │   ├── hooks/                    # API and theme hooks
│   │   ├── lib/                      # Axios client and utilities
│   │   ├── mock/                     # UI fallback/demo data
│   │   ├── pages/                    # Public, auth, dashboard, and extra pages
│   │   ├── types/                    # Shared frontend types
│   │   ├── App.tsx                   # Route configuration
│   │   └── main.tsx                  # React entry point
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
├── .github/                          # CI, Dependabot, issue forms, PR template
├── FixItNow.postman_collection.json  # API request collection
├── render.yaml                       # Render backend blueprint
├── LICENSE
├── README.md
└── .gitignore
```

## Quick Start

### Prerequisites

- Node.js 20 or newer. The current Vite dependency tree includes packages requiring Node 20.
- PostgreSQL 14 or newer for runtime and database setup.
- npm 10 or newer, included with current Node.js releases.
- A Stripe test account if you want to exercise the PaymentIntent flow.
- Git.

### Install dependencies

The frontend and backend are intentionally independent npm packages with separate lockfiles.

```bash
git clone https://github.com/raskirayhan/FixItNow-.git
cd FixItNow

cd backend
npm ci

cd ../frontend
npm ci
```

### Create local environment files

Copy the examples and replace every placeholder locally. Do not commit either `.env` file.

```bash
# macOS/Linux
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Windows PowerShell equivalent
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

### Prepare PostgreSQL and Prisma

Create a local PostgreSQL database that matches `DATABASE_URL`, then run the backend database commands:

```bash
cd backend
npm run db:generate
npm run db:push
# Set SEED_PASSWORD and optionally SEED_ADMIN_EMAIL in backend/.env first.
npm run db:seed
```

`db:push` is convenient for local development. Use a reviewed migration and rollback process for shared or production databases. The seed command requires a private `SEED_PASSWORD` and should be treated as local-only until its data policy is reviewed.

### Run the application

Use two terminals:

```bash
# Terminal 1: backend
cd backend
npm run dev
```

```bash
# Terminal 2: frontend
cd frontend
npm run dev
```

Local URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend root | `http://localhost:5000/` |
| API health | `http://localhost:5000/api/health` |
| Swagger UI | `http://localhost:5000/api/docs` or `http://localhost:5000/api-docs` |
| OpenAPI JSON | `http://localhost:5000/api/docs.json` |

### Build locally

There is no root package script. Build each package from its own directory:

```bash
cd backend
npm run build
npm start
```

```bash
cd frontend
npm run lint
npm run build
npm run preview
```

## Configuration

### Backend variables

`backend/.env.example` is the canonical list of backend variables. Values below are descriptions only; no credentials are published in this repository's documentation.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `JWT_SECRET` | Yes | Long, random signing key for authentication tokens. Use a different value per environment. |
| `STRIPE_SECRET_KEY` | For Stripe flows | Server-side Stripe API key. Use a test-mode key locally and store it only in a secret manager or ignored `.env`. |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Secret used to verify the `Stripe-Signature` header. |
| `FRONTEND_URL` | Recommended | Comma-separated allowed frontend origins. Local development defaults to `http://localhost:5173`. |
| `PORT` | No | HTTP port; defaults to `5000`. |
| `NODE_ENV` | Deployment | Set to `production` on the hosting platform. |
| `SEED_ADMIN_EMAIL` | When seeding | Local or deployment email for the seeded administrator; defaults to a non-routable example address. |
| `SEED_PASSWORD` | When seeding | Private password used for local seed records; never commit it or reuse it in production. |

### Frontend variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | No for local dev | Backend origin for production. Leave blank locally so Vite proxies `/api`; the client normalizes an origin with or without `/api`. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | When client-side Stripe Elements are enabled | Publishable Stripe key. It is not a server secret, but it should still be configured per environment rather than hard-coded. |

Vite embeds `VITE_*` values into the browser bundle. Never put a database URL, JWT signing key, Stripe secret key, webhook secret, or other private credential in a `VITE_*` variable.

### Package scripts

| Package | Script | Purpose |
| --- | --- | --- |
| Backend | `npm run dev` | Run the API with nodemon and `tsx`. |
| Backend | `npm run build` | Compile TypeScript to `dist/`. |
| Backend | `npm run start` | Run the compiled server. |
| Backend | `npm run db:generate` | Generate the Prisma client. |
| Backend | `npm run db:push` | Push the Prisma schema to a database. |
| Backend | `npm run db:migrate` | Run Prisma's development migration command. |
| Backend | `npm run db:seed` | Seed local/demo records. |
| Backend | `npm run db:studio` | Open Prisma Studio. |
| Frontend | `npm run dev` | Start the Vite development server. |
| Frontend | `npm run lint` | Run Oxlint. |
| Frontend | `npm run build` | Type-check and create the Vite production bundle. |
| Frontend | `npm run preview` | Serve the production bundle locally. |

## API Documentation

Swagger UI is generated from the route annotations and is available while the backend is running:

- Interactive UI: [`/api/docs`](http://localhost:5000/api/docs)
- Compatibility alias: [`/api-docs`](http://localhost:5000/api-docs)
- OpenAPI JSON: [`/api/docs.json`](http://localhost:5000/api/docs.json)
- Postman collection: [`FixItNow.postman_collection.json`](FixItNow.postman_collection.json)

Protected requests use a JWT bearer token:

```http
Authorization: Bearer <token>
```

The Postman collection uses empty variables for account values by design. Set credentials in a private local Postman environment or create local accounts; this repository does not publish default login credentials.

## API Reference

The API is mounted under `/api`. UUID path parameters are shown as `:id`, `:technicianId`, `:bookingId`, `:notificationId`, or `:userId` below.

### System

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/` | API welcome/status response | Public |
| `GET` | `/api/health` | Health check with timestamp | Public |

### Authentication

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a customer or technician; role is optional | Public |
| `POST` | `/api/auth/login` | Authenticate with email and password | Public |
| `GET` | `/api/auth/me` | Return the current authenticated user | Bearer token |

### Profiles

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/profile/me` | Return the current user's full profile | Bearer token |
| `PUT` | `/api/profile/me` | Update name, phone, location, or bio | Bearer token |
| `PUT` | `/api/profile/change-password` | Change the current password | Bearer token |
| `PUT` | `/api/profile/technician` | Update technician bio, experience, skills, and rate | Technician |

### Services and categories

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/services` | List services; supports `search`, `categoryId`, and `minRating` filters | Public |
| `GET` | `/api/services/categories` | List service categories | Public |
| `GET` | `/api/services/:id` | Return service details | Public |
| `GET` | `/api/services/technician/:technicianId` | List a technician's services | Public |
| `POST` | `/api/services` | Create a service with category, title, description, and price | Technician |

### Bookings

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/bookings` | Create a booking with `serviceId`, ISO `scheduledAt`, and optional `timeSlot` | Customer |
| `PATCH` | `/api/bookings/:id/status` | Move a booking through an allowed status transition | Customer or Technician |
| `GET` | `/api/bookings/customer` | List the current customer's bookings | Customer |
| `GET` | `/api/bookings/technician` | List the current technician's bookings | Technician |

Booking statuses in the data model are `REQUESTED`, `ACCEPTED`, `DECLINED`, `PAID`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`. Request validation limits which statuses can be submitted through the update endpoint.

### Payments

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/payments/create` | Create a Stripe PaymentIntent for an accepted booking | Customer |
| `POST` | `/api/payments/webhook` | Process signed Stripe payment events | Public route with Stripe signature verification |

The webhook endpoint must receive the raw request body and a valid `Stripe-Signature` header. Configure Stripe to send events to `/api/payments/webhook`.

### Reviews

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/reviews/technician/:technicianId` | List reviews for a technician | Public |
| `POST` | `/api/reviews` | Add a 1-5 rating and optional comment for a completed booking | Customer |

### Wallet and transactions

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/wallet` | Return the current user's wallet and recent transactions | Bearer token |
| `POST` | `/api/wallet/add` | Credit an amount to the current user's wallet | Bearer token |
| `GET` | `/api/wallet/transactions` | Return wallet transaction history | Bearer token |

### Notifications

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/notifications` | List the current user's notifications | Bearer token |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read | Bearer token |
| `PATCH` | `/api/notifications/:id/read` | Mark one notification as read | Bearer token |

### Administration

All administration routes require a bearer token for a user with the `ADMIN` role.

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/admin/stats` | Return dashboard statistics | Admin |
| `GET` | `/api/admin/users` | List users | Admin |
| `PATCH` | `/api/admin/users/:id/ban` | Set a user's status to `ACTIVE` or `BANNED` | Admin |
| `GET` | `/api/admin/bookings` | List bookings | Admin |
| `GET` | `/api/admin/categories` | List categories with service counts | Admin |

## Security

The current implementation includes several useful baseline controls:

- Passwords are hashed with bcryptjs before persistence.
- JWTs are required for protected routes and role middleware restricts customer, technician, and admin operations.
- Banned users are rejected during login.
- Zod validates request bodies before controller logic runs.
- Helmet adds HTTP security headers, CORS restricts browser origins, and express-rate-limit applies a global 100-request-per-15-minute window.
- Stripe webhook requests use the raw body and signature verification path.
- `.env` files, dependency directories, build output, and logs are ignored by Git.

Operational rules:

1. Generate a unique high-entropy `JWT_SECRET` for every environment.
2. Use Stripe test keys locally and live keys only through a production secret manager.
3. Never commit `.env`, database URLs, bearer tokens, webhook secrets, or private API keys.
4. Rotate any credential that has been exposed, including credentials created by local seed data before a database is shared.
5. Review CORS origins and rate-limit behavior before exposing the API publicly.

The browser currently stores the JWT in `localStorage`. This is acceptable for a prototype but increases the impact of an XSS vulnerability; a secure, HttpOnly session strategy is a planned hardening item.

See [SECURITY.md](SECURITY.md) for private vulnerability reporting and response guidance.

## Deployment

### Backend on Render

[`render.yaml`](render.yaml) defines a Node web service rooted at `backend`:

- Build: install dependencies, generate Prisma client, push the schema, seed data, and compile TypeScript.
- Start: `npm start`.
- Health check: `/api/health`.
- Auto deploy: enabled by the blueprint.

Deployment steps:

1. Push the repository to GitHub and connect it to Render.
2. Apply the blueprint from `render.yaml`.
3. Add `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL`, `SEED_ADMIN_EMAIL`, and `SEED_PASSWORD` in Render's environment settings.
4. Set `FRONTEND_URL` to the exact frontend origin, or a comma-separated list of approved origins.
5. Configure the Stripe webhook endpoint at `<backend-origin>/api/payments/webhook`.
6. Verify `<backend-origin>/api/health` before connecting the frontend.

The included blueprint currently runs `prisma db push` and `db:seed` during every Render build. Treat that as a development-friendly deployment shortcut, not a production migration strategy. Review the command before pointing it at a shared or production database.

### Frontend on a static host

Deploy the `frontend` directory to a static host such as Vercel, Netlify, or another platform that supports Vite SPAs:

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| `VITE_API_URL` | The deployed backend origin |

Configure an SPA fallback to `index.html` so React Router routes work on direct navigation. Add the resulting frontend origin to the backend's `FRONTEND_URL` value. Do not upload local `.env` files; configure platform environment variables instead.

## Roadmap

- [ ] Add unit, integration, and end-to-end coverage for auth, booking transitions, payments, and role boundaries.
- [ ] Replace browser `localStorage` JWT storage with secure HttpOnly cookies and an appropriate CSRF strategy.
- [ ] Complete Stripe Elements integration and make payment state changes idempotent and observable.
- [ ] Replace wallet crediting and non-Stripe checkout demos with provider-backed transaction flows.
- [ ] Introduce reviewed Prisma migrations, rollback guidance, and safe production seeding.
- [ ] Add technician verification, approval, and document workflows.
- [ ] Add pagination, scheduling conflict checks, and stronger transaction invariants.
- [ ] Add structured logs, error tracking, metrics, and deployment smoke tests.

## Known Issues and Limitations

- Neither package currently defines an automated test script; CI validates frontend lint/build and backend compilation only.
- The seed implementation creates sample users and records using the private `SEED_PASSWORD`; use it only with a disposable database and review the Render seed-on-build behavior before deploying.
- The Render blueprint seeds the database during deployment, which can create or update demo records on a shared database.
- The frontend checkout includes simulated paths for some payment methods and uses mock/fallback data in parts of the UI. The backend Stripe PaymentIntent and webhook endpoints are the authoritative integration points today.
- The wallet credit endpoint records a completed credit directly and is not itself a payment-provider funding flow.
- Authentication tokens are stored in `localStorage`, as described in the security section.
- There is currently no complete technician verification workflow or separate admin provisioning flow in the public registration API.
- Prisma schema changes are currently documented around `db:push`; a production migration history is not yet part of the repository.

## FAQ

### Why are frontend and backend commands separate?

They are independent npm packages with their own manifests, lockfiles, build tools, and deployment concerns. Run each command from the matching directory.

### Do I need PostgreSQL to run a frontend build?

No. The frontend build is static. PostgreSQL is required for the backend to serve database-backed requests and for Prisma setup/seed commands.

### Where is the API documentation?

Start the backend and open `/api/docs`. `/api-docs` is also supported, and `/api/docs.json` returns the generated OpenAPI document.

### Why does the frontend work without `VITE_API_URL` locally?

Vite proxies `/api` to `http://localhost:5000` during development. Set `VITE_API_URL` when the frontend and backend are deployed on different origins.

### Are demo usernames and passwords published here?

No. Public docs and the Postman collection intentionally contain no default credentials. Create local accounts or configure private local test variables, and rotate any seeded credentials before sharing a database.

### How can I test Stripe webhooks locally?

Use Stripe test credentials and the Stripe CLI to forward events to the raw-body webhook route:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Set the signing secret printed by the CLI in `STRIPE_WEBHOOK_SECRET`; never commit it.

### Is this production-ready?

Not yet. It is a strong full-stack portfolio foundation, but the known limitations around testing, payment completeness, token storage, migrations, and seed/deployment behavior should be addressed before production use.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Contributions should be focused, tested with the package scripts that exist today, and free of secrets or customer data.

## Acknowledgements

FixItNow builds on the work of the React, Vite, TypeScript, Express, Prisma, PostgreSQL, Stripe, TanStack Query, Tailwind CSS, Radix UI, Framer Motion, Axios, Swagger, and Oxlint communities. The UI combines Radix primitives with a shadcn-inspired component structure.

## License

This repository is licensed under the [MIT License](LICENSE).
