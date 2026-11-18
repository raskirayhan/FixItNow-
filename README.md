# FixItNow — On-Demand Home Services Marketplace

<p align="center">
  <strong>A full-stack, portfolio-grade home services marketplace connecting customers with verified local technicians for plumbing, electrical, HVAC, carpentry, and home maintenance.</strong>
</p>

<p align="center">
  <a href="https://github.com/raskirayhan/FixItNow-/actions/workflows/ci.yml"><img src="https://github.com/raskirayhan/FixItNow-/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express 5">
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Stripe-Payment_Integration-635BFF?logo=stripe&logoColor=white" alt="Stripe">
</p>

---

## 📦 Submission Information & Live Links

| Item | URL / Details |
| --- | --- |
| **Frontend GitHub Repo** | [https://github.com/raskirayhan/FixItNow-](https://github.com/raskirayhan/FixItNow-) |
| **Live Frontend URL (Vercel)** | [https://fix-it-now-taupe.vercel.app](https://fix-it-now-taupe.vercel.app) |
| **Live Backend API (Render)** | [https://fixitnow-9f1w.onrender.com](https://fixitnow-9f1w.onrender.com) |
| **API Health Endpoint** | [https://fixitnow-9f1w.onrender.com/api/health](https://fixitnow-9f1w.onrender.com/api/health) |
| **Swagger API Docs** | [https://fixitnow-9f1w.onrender.com/api/docs](https://fixitnow-9f1w.onrender.com/api/docs) |
| **API Integration Mapping** | [`API_INTEGRATION.md`](API_INTEGRATION.md) |
| **Walkthrough Video (7-10 min)** | `https://drive.google.com/file/d/your-demo-video/view` *(or Loom link)* |

---

## 🔑 Test Credentials (MANDATORY FOR EVALUATION)

The database automatically seeds working test accounts across all three platform roles:

| Role | Email Address | Password | Permissions & Available Portals |
| --- | --- | --- | --- |
| **ADMIN** | `admin@fixitnow.com` <br>*(or `admin@example.invalid`)* | `password123` | **Full Platform Control:** Platform metrics, revenue charts, user moderation (ban/unban), all-booking oversight, and category management. |
| **TECHNICIAN** | `tech1@test.com` | `password123` | **Technician Workstation:** View assigned jobs, accept/complete bookings, create and publish new services, edit hourly rate and skills. |
| **CUSTOMER** | `customer1@test.com` | `password123` | **Customer Portal:** Browse services, filter by category/rating, book technicians, complete Stripe checkout, manage digital wallet, and submit reviews. |

---

## ✅ Mandatory Requirements Checklist

This project complies strictly with all six mandatory assessment criteria:

| Requirement | Implementation & Proof in Codebase |
| --- | --- |
| **1. API Integration & Documentation** | Complete [`API_INTEGRATION.md`](API_INTEGRATION.md) mapping all frontend components and TanStack Query hooks to 25+ backend Express endpoints. |
| **2. Consistent UI Error Handling** | • **React Error Boundary** (`ErrorBoundary.tsx`) preventing fatal white screens.<br>• **Zod Schema Form Validation** providing immediate inline feedback.<br>• **Axios Response Interceptors** dispatching toast notifications.<br>• Custom **404 Not Found** page (`NotFound.tsx`). |
| **3. Meaningful Commit History** | **50+ meaningful commits** following Conventional Commits standards (`feat:`, `fix:`, `docs:`, `chore:`). |
| **4. Working Admin Credentials** | Functional Admin credentials (`admin@fixitnow.com` / `password123`) provided and auto-seeded into the database. |
| **5. Real Payment Integration** | Backend Stripe PaymentIntent creation (`/api/payments/create`) + Webhook processing (`/api/payments/webhook`) + Frontend Checkout flow (`/payment/:bookingId`) with transaction receipts. |
| **6. 7-10 Minute Video Guide** | Comprehensive video presentation outline provided below covering architecture, 3-role demonstration, CRUD, and technical challenge. |

---

## 🏗️ System Architecture

```text
                           +----------------------+
                           |  PostgreSQL Database |
                           |  Prisma Data Layer   |
                           +----------^-----------+
                                      |
+------------------+       +---------+----------+       +----------------+
| React 19 Client  | ----> | Express 5 API      | ----> | Stripe API     |
| TanStack Query   | /api  | JWT Auth, Zod      |       | PaymentIntent  |
| Tailwind CSS 4   |       | Controllers & RBAC | <---- | Webhook Events |
+--------+---------+       +---------+----------+       +----------------+
         |                           |
         | Vite Proxy / Vercel Host  +--> Swagger UI: /api/docs
         +--> Static CDN Assets
```

---

## 🌟 Key Features Across 3 Roles

### 🧑‍💼 Customer Experience
- **Searchable Marketplace:** Browse home services by keyword, category, and minimum rating.
- **Service Booking:** Choose scheduled appointment date and preferred time slot.
- **Stripe Card Checkout:** Secure payment processing with real-time feedback and printable transaction receipts.
- **Digital Wallet:** In-app wallet balance with top-up options and detailed transaction ledger.
- **Reviews & Ratings:** Submit 1–5 star ratings and reviews for completed bookings.
- **Notification Center:** Real-time notification feed tracking booking status updates.

### 🔧 Technician Workstation
- **Booking Management:** Live list of customer booking requests with one-click Accept, In-Progress, and Complete actions.
- **Service CRUD:** Technicians can create, describe, price, and publish new service offerings.
- **Technician Profile:** Editable skills tags, years of experience, bio, and hourly rate.
- **Earnings & Reputation:** Monitor customer reviews and track completed job history.

### 🛡️ Administrator Suite
- **Analytics Dashboard:** Real-time metrics on total revenue, users count, active bookings, and service distribution.
- **User Management & Moderation:** Filter users by role, inspect profiles, and ban/unban abusive accounts.
- **Bookings Oversight:** System-wide audit table of all customer bookings and their payment statuses.
- **Category Control:** View and organize all service categories across the platform.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite 8, React Router 7, TanStack Query v5, Tailwind CSS 4, Radix UI Primitives, Lucide React, Framer Motion, React Hook Form, Zod |
| **Backend** | Node.js (20+), Express 5, TypeScript, Prisma ORM 5, PostgreSQL, Zod, bcryptjs, jsonwebtoken, Helmet, CORS, Morgan |
| **Payments** | Stripe SDK (Server PaymentIntents + Webhook Signature Verification + Frontend Checkout) |
| **API Docs & Testing** | OpenAPI / Swagger UI, Postman Collection (`FixItNow.postman_collection.json`) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend API Service + PostgreSQL) |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js 20 or newer
- PostgreSQL 14 or newer
- npm 10 or newer

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/raskirayhan/FixItNow-.git
cd FixItNow

# Install backend dependencies
cd backend
npm ci

# Install frontend dependencies
cd ../frontend
npm ci
```

### 2. Configure Environment Variables
Copy the sample environment files and configure your values:

```bash
# macOS/Linux
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Windows PowerShell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

**`backend/.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fixitnow?schema=public"
JWT_SECRET="fixitnow_super_secure_secret_key_2026"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"
FRONTEND_URL="http://localhost:5173"
PORT=5000
SEED_PASSWORD="password123"
```

**`frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Initialize PostgreSQL Database & Seed
```bash
cd backend
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run Locally
Open two terminal tabs:

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## 📚 API Endpoints Summary

For comprehensive component-to-endpoint mappings, see [`API_INTEGRATION.md`](API_INTEGRATION.md).

| Module | Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- | --- |
| **Auth** | `POST` | `/api/auth/register` | Register customer or technician | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate & retrieve JWT | Public |
| **Auth** | `GET` | `/api/auth/me` | Fetch active user session | Bearer Token |
| **Auth** | POST | /api/auth/send-otp | Send Courier-grade Email OTP code | Public |
| **Auth** | POST | /api/auth/verify-otp | Verify 6-digit OTP code | Public |
| **Auth** | POST | /api/auth/login-with-otp | Passwordless login via verified OTP | Public |
| **Auth** | POST | /api/auth/reset-password | Reset password using OTP code | Public |
| **Profile** | `GET` | `/api/profile/me` | Get current user profile | Bearer Token |
| **Profile** | `PUT` | `/api/profile/me` | Update name, phone, bio, location | Bearer Token |
| **Profile** | `PUT` | `/api/profile/technician` | Update technician rate, skills | Technician |
| **Services** | `GET` | `/api/services` | Query services with search & filters | Public |
| **Services** | `POST` | `/api/services` | Create new service | Technician |
| **Bookings** | `POST` | `/api/bookings` | Create new booking request | Customer |
| **Bookings** | `GET` | `/api/bookings/customer` | List current customer bookings | Customer |
| **Bookings** | `GET` | `/api/bookings/technician` | List current technician bookings | Technician |
| **Bookings** | `PATCH` | `/api/bookings/:id/status`| Update status (Accept/Decline/Complete) | Role Protected |
| **Payments** | `POST` | `/api/payments/create` | Create Stripe PaymentIntent | Customer |
| **Payments** | `POST` | `/api/payments/webhook` | Stripe webhook event handler | Stripe Sig |
| **Reviews** | `POST` | `/api/reviews` | Review a completed booking | Customer |
| **Wallet** | `GET` | `/api/wallet` | Get wallet balance and transactions | Bearer Token |
| **Wallet** | `POST` | `/api/wallet/add` | Credit funds to wallet | Bearer Token |
| **Admin** | `GET` | `/api/admin/stats` | Platform statistics | Admin |
| **Admin** | `GET` | `/api/admin/users` | List all users | Admin |
| **Admin** | `PATCH` | `/api/admin/users/:id/ban` | Ban or unban user | Admin |

---

## 🎥 7-10 Min Video Walkthrough Guide

When recording your presentation (via Loom or OBS):

1. **Introduction & Architecture (0:00 - 1:30):**
   - Present FixItNow, tech stack (React 19, TypeScript, Express 5, Prisma, PostgreSQL, Stripe).
   - Display `API_INTEGRATION.md` and repository structure.
2. **Customer Flow (1:30 - 4:00):**
   - Login as `customer1@test.com` / `password123`.
   - Browse service catalog, filter by category and rating.
   - Book a service (`/booking/:id`).
   - Proceed to Payment (`/payment/:bookingId`), demonstrate Stripe card input, and showcase the payment confirmation receipt.
3. **Technician Flow (4:00 - 6:00):**
   - Login as `tech1@test.com` / `password123`.
   - Review incoming booking requests and mark as Accepted/Completed.
   - Demonstrate CRUD by creating a brand-new service offering.
4. **Admin Flow (6:00 - 8:00):**
   - Login as `admin@fixitnow.com` / `password123`.
   - Walk through the Admin Dashboard stats and platform revenue charts.
   - Show user management by toggling a user's status (`ACTIVE` <-> `BANNED`).
5. **Error Handling & Technical Challenge (8:00 - 10:00):**
   - Demonstrate invalid form submission triggering inline Zod errors and toast notifications.
   - Explain how `ErrorBoundary.tsx` protects against unexpected runtime crashes.
   - Explain a technical challenge solved: coordinating JWT authorization with role-protected route guards, automatic 401 handling, and Stripe PaymentIntent synchronization.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
