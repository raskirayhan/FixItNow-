# FixItNow — Frontend Client

A responsive, high-performance home-services marketplace frontend built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **TanStack Query**.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query)

---

## 📌 Project Overview

FixItNow connects homeowners with verified local technicians for plumbing, electrical, cleaning, carpentry, and home maintenance. The frontend offers role-adaptive layouts, real-time booking updates, full CRUD workflows, secure Stripe payment checkout, and comprehensive error handling.

- **Live Frontend URL:** [https://fix-it-now-taupe.vercel.app](https://fix-it-now-taupe.vercel.app)
- **Backend API URL:** [https://fixitnow-9f1w.onrender.com](https://fixitnow-9f1w.onrender.com)
- **API Documentation Mapping:** [`API_INTEGRATION.md`](../API_INTEGRATION.md)

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| **Framework** | React 19 + TypeScript | Core UI framework with end-to-end type safety |
| **Build Tool** | Vite 8 | Fast ESM bundler & Hot Module Replacement (HMR) |
| **Routing** | React Router 7 | Dynamic routing, role-protected routes, nested dashboards |
| **Server State** | TanStack Query v5 (React Query) | Caching, optimistic updates, automatic refetching, background sync |
| **Client State** | React Context API | Global authentication state (`AuthContext`) and theme toggle (`ThemeContext`) |
| **Styling** | Tailwind CSS v4 + Radix UI Primitives | Modern UI styling with fully accessible, headless UI primitives |
| **Animations** | Framer Motion | Smooth page transitions and micro-interactions |
| **Form Handling** | React Hook Form + Zod | Schema-based validation with instant inline error feedback |
| **HTTP Client** | Axios | Configured with token interceptors, automatic error handling |
| **Payments** | Stripe.js | Frontend payment checkout flow & payment intent confirmation |

---

## 👥 Three Role-Based User Portals

The application adapts dynamically to the authenticated user's assigned role:

### 1. 🧑‍💼 Customer Portal (`/customer`)
- **Service Exploration:** Filterable and searchable marketplace catalog with categories and ratings.
- **Service Booking:** Schedule on-demand appointments with date and time slots.
- **Payment Processing:** Integrated Stripe card checkout with instant confirmation receipts.
- **Wallet & Transactions:** Manage digital balance, add funds, and view transaction history.
- **Reviews & Ratings:** Submit verified feedback on completed service bookings.
- **Notification Center:** Real-time updates on booking acceptances, technician arrival, and completion.

### 2. 🔧 Technician Workstation (`/technician`)
- **Job Workload Management:** Real-time dashboard to review, accept, decline, or mark bookings as completed.
- **Service Catalog CRUD:** Create, update, and publish offered repair services with pricing.
- **Professional Profile:** Manage hourly rate, years of experience, skill tags, and biography.
- **Earnings & Reviews:** Review client ratings and monitor earnings per completed service.

### 3. 🛡️ Administrator Operations Suite (`/admin`)
- **Platform Analytics:** Real-time stats on total revenue, active users, completed bookings, and services.
- **User Moderation:** Comprehensive user tables with active/banned toggling.
- **Booking Oversight:** Monitor and audit all platform bookings across all roles.
- **Category Management:** Manage categories and oversee service catalog distributions.

---

## 🛡️ Error Handling & UI Resilience

FixItNow implements multi-layered error handling to guarantee zero unexplained crashes:

1. **Top-Level Error Boundary (`ErrorBoundary.tsx`):** Catches any uncaught runtime JavaScript exceptions in the React tree, rendering a graceful recovery screen with a "Reload" and "Return Home" action instead of a blank white screen.
2. **Global Axios Interceptor:** Automatically catches HTTP errors:
   - `401 Unauthorized`: Clears expired JWT session, resets `AuthContext`, and redirects to `/login`.
   - `403 Forbidden`: Renders access denied state.
   - `500 Server Error`: Displays a structured user-friendly toast message.
3. **Form Validation (Zod):** Validates user inputs with immediate inline error text before submission.
4. **Toast Feedback:** Visual notifications for every CRUD operation (Success, Info, Warning, Error).
5. **Graceful 404 Page (`NotFound.tsx`):** Clean fallback for any undefined routes.

---

## 💳 Payment Integration Flow

FixItNow integrates real payment gateway processing using **Stripe**:

1. Customer books a service (`REQUESTED` status).
2. Technician accepts the request (`ACCEPTED` status).
3. Customer navigates to Checkout (`/payment/:bookingId`).
4. Frontend initiates a backend call to `/api/payments/create`, receiving a Stripe `clientSecret` and `PaymentIntent ID`.
5. Customer submits card details, and the payment status updates through `processing` to `success`.
6. Successful payment displays full transaction receipt with booking ID and download options.
7. Backend webhook updates booking status to `PAID`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or newer
- npm 10 or newer

### Installation
```bash
# Clone the repository
git clone https://github.com/raskirayhan/FixItNow-.git
cd FixItNow/frontend

# Install dependencies
npm ci
```

### Environment Configuration
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
```

### Available Scripts
```bash
# Start development server
npm run dev

# Run Oxlint linter
npm run lint

# Build production bundle with type check
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Folder Architecture

```text
frontend/src/
├── components/
│   ├── layout/            # Navbar, Footer, PageHeader
│   ├── shared/            # ErrorBoundary, CookieConsent, AnimatedCard
│   ├── ui/                # Accessible Radix + Tailwind components (Button, Dialog, Toast, etc.)
│   └── ProtectedRoute.tsx # Route guard checking authentication and role authorization
├── context/
│   ├── AuthContext.tsx    # JWT authentication state, user session, login/logout
│   └── ThemeContext.tsx   # Dark/light mode theme provider
├── hooks/
│   ├── useApi.ts          # Centralized TanStack Query hooks for all endpoints
│   └── useTheme.ts        # Theme hook
├── lib/
│   ├── api.ts             # Axios client with interceptors
│   ├── queryClient.ts     # TanStack Query client configuration
│   └── utils.ts           # Class utilities and formatters
├── mock/                  # Demo fallback data
├── pages/
│   ├── admin/             # Dashboard, Users, Bookings, Categories, Payments, Reviews
│   ├── auth/              # Login, Register, ForgotPassword, ResetPassword
│   ├── customer/          # Customer Dashboard, Bookings, Reviews
│   ├── extra/             # About, Contact, Blog, Terms, Privacy, NotFound (404)
│   ├── notifications/     # NotificationCenter
│   ├── profile/           # User Profile & Technician Profile edit
│   ├── technician/        # Technician Dashboard, Service Creation, Job management
│   ├── Booking.tsx        # Service booking flow
│   ├── Landing.tsx        # Homepage with hero, services preview, testimonials
│   ├── Payment.tsx        # Stripe checkout & receipt flow
│   ├── Services.tsx       # Searchable catalog
│   ├── TechnicianProfile.tsx # Public technician profile
│   └── Wallet.tsx         # Digital wallet & transaction ledger
├── types/                 # TypeScript interfaces and domain types
├── App.tsx                # Main router configuration & layout assembly
└── main.tsx               # Root entry point wrapped in ErrorBoundary & Providers
```

---

## 📄 License
This project is licensed under the [MIT License](../LICENSE).
