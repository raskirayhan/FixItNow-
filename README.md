# FixItNow

A full-stack home services marketplace connecting customers with verified home service professionals.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite 8, TanStack Query, React Router v7, TailwindCSS v4, React Hook Form + Zod, Framer Motion, Radix UI (shadcn pattern)

**Backend:** Express 5, TypeScript, Prisma ORM 5, PostgreSQL, JWT Authentication, Stripe Payments, Zod Validation

**Infrastructure:** Swagger API Documentation, Helmet Security, CORS, Rate Limiting, Morgan Logging

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FixItNow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL, JWT secret, and Stripe keys

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your Stripe publishable key
```

### Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed
```

### Running the Application

```bash
# Backend (from backend/ directory)
npm run dev

# Frontend (from frontend/ directory, in a separate terminal)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health
- API Documentation: http://localhost:5000/api/docs

## API Documentation

Interactive Swagger UI is available at `/api/docs` when the backend is running.

The Swagger JSON specification is available at `/api/docs.json`.

A Postman collection is included: `FixItNow.postman_collection.json`

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fixitnow.com | admin123 |
| Customer | customer1@test.com | Password123! |
| Customer | customer2@test.com | Password123! |
| Customer | customer3@test.com | Password123! |
| Technician | tech1@test.com | Password123! |
| Technician | tech2@test.com | Password123! |
| Technician | tech3@test.com | Password123! |

## Project Structure

```
FixItNow/
├── backend/                    # Express API server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (11 models)
│   │   └── seed.ts             # Database seeder
│   ├── src/
│   │   ├── config/             # DB, Stripe, Swagger config
│   │   ├── controllers/        # Route handlers (9 controllers)
│   │   ├── middlewares/        # Auth, validation, error handling
│   │   ├── routes/             # API routes (9 route files)
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth and Theme context
│   │   ├── hooks/              # TanStack Query hooks
│   │   ├── lib/                # API client, utilities
│   │   ├── pages/              # Page components
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Router configuration
│   │   └── main.tsx            # Entry point
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── render.yaml                 # Render deployment config
├── FixItNow.postman_collection.json
├── PROJECT_SUMMARY.txt
├── README.md
└── .gitignore
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |

### Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/profile/me | Get full profile | Yes |
| PUT | /api/profile/me | Update profile | Yes |
| PUT | /api/profile/change-password | Change password | Yes |
| PUT | /api/profile/technician | Update technician profile | Technician |

### Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/services | List services (search, filter) | No |
| GET | /api/services/categories | List categories | No |
| GET | /api/services/:id | Get service details | No |
| GET | /api/services/technician/:id | Get technician services | No |
| POST | /api/services | Create service | Technician |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/bookings | Create booking | Customer |
| PATCH | /api/bookings/:id/status | Update status | Customer/Tech |
| GET | /api/bookings/customer | Customer bookings | Customer |
| GET | /api/bookings/technician | Technician bookings | Technician |

### Payments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/payments/create | Create Stripe payment | Customer |
| POST | /api/payments/webhook | Stripe webhook | No |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/reviews/technician/:id | Get technician reviews | No |
| POST | /api/reviews | Create review | Customer |

### Wallet
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/wallet | Get wallet | Yes |
| POST | /api/wallet/add | Add money | Yes |
| GET | /api/wallet/transactions | Transaction history | Yes |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/notifications | Get notifications | Yes |
| PATCH | /api/notifications/read-all | Mark all read | Yes |
| PATCH | /api/notifications/:id/read | Mark one read | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/admin/stats | Dashboard statistics | Admin |
| GET | /api/admin/users | List all users | Admin |
| PATCH | /api/admin/users/:id/ban | Ban/unban user | Admin |
| GET | /api/admin/bookings | List all bookings | Admin |
| GET | /api/admin/categories | List all categories | Admin |

### Health
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/health | Health check | No |

## Deployment

### Render

A `render.yaml` configuration file is included for deploying to Render.

1. Push to GitHub
2. Connect your repository to Render
3. Render will auto-detect the `render.yaml` configuration
4. Set environment variables in the Render dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `FRONTEND_URL`: Your deployed frontend URL
5. Deploy

**Note:** Do not commit real API keys or secrets to the repository.

## License

ISC
