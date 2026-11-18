# API Integration & Mapping Document

This document maps all frontend components, pages, and hooks to their corresponding backend API endpoints in the **FixItNow** application.

---

## 1. Authentication & Session Management

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/auth/Login.tsx` | `useLogin()` | `/api/auth/login` | `POST` | Public | Authenticates user with email & password, stores JWT token. |
| `src/pages/auth/Login.tsx` | `useLoginWithOtp()` | `/api/auth/login-with-otp` | `POST` | Public | Instant Courier fast login via 6-digit OTP. |
| `src/pages/auth/Register.tsx` | `useRegister()` | `/api/auth/register` | `POST` | Public | Registers a new Customer or Technician account with automatic starter wallet. |
| `src/context/AuthContext.tsx` | `useMe()` | `/api/auth/me` | `GET` | Bearer Token | Fetches currently logged-in user details and role. |
| `src/pages/auth/ForgotPassword.tsx` | `useSendOtp()` | `/api/auth/send-otp` | `POST` | Public | Dispatches 6-digit Courier OTP to user email. |
| `src/pages/auth/OtpVerification.tsx` | `useVerifyOtp()` | `/api/auth/verify-otp` | `POST` | Public | Validates 6-digit Courier OTP code against backend. |
| `src/pages/auth/ResetPassword.tsx` | `useResetPassword()` | `/api/auth/reset-password` | `POST` | Public | Resets user password using verified OTP code. |

---

## 2. Profile Management

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/profile/Profile.tsx` | `useProfile()` | `/api/profile/me` | `GET` | Bearer Token | Fetches full user profile details. |
| `src/pages/profile/Profile.tsx` | `useUpdateProfile()` | `/api/profile/me` | `PUT` | Bearer Token | Updates name, phone, location, bio. |
| `src/pages/profile/Profile.tsx` | `useChangePassword()` | `/api/profile/change-password` | `PUT` | Bearer Token | Changes current user password. |
| `src/pages/profile/Profile.tsx` | `useUpdateTechnicianProfile()` | `/api/profile/technician` | `PUT` | Technician | Updates technician skills, rate, experience. |

---

## 3. Services & Categories Catalog

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/Landing.tsx`, `Services.tsx` | `useServices()` | `/api/services` | `GET` | Public | Lists services with category/search/rating filters. |
| `src/pages/Landing.tsx`, `Services.tsx` | `useCategories()` | `/api/services/categories` | `GET` | Public | Fetches all service categories. |
| `src/pages/Booking.tsx` | `useService()` | `/api/services/:id` | `GET` | Public | Gets single service details for booking. |
| `src/pages/TechnicianProfile.tsx` | `useTechnicianServices()` | `/api/services/technician/:id` | `GET` | Public | Fetches services provided by a specific technician. |
| `src/pages/technician/Dashboard.tsx` | `useCreateService()` | `/api/services` | `POST` | Technician | Enables technicians to post a new service. |

---

## 4. Bookings Lifecycle

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/Booking.tsx` | `useCreateBooking()` | `/api/bookings` | `POST` | Customer | Creates a new service booking request. |
| `src/pages/customer/Dashboard.tsx` | `useCustomerBookings()` | `/api/bookings/customer` | `GET` | Customer | Lists all bookings for the active customer. |
| `src/pages/technician/Dashboard.tsx` | `useTechnicianBookings()` | `/api/bookings/technician` | `GET` | Technician | Lists assigned bookings for the active technician. |
| `src/pages/customer/Dashboard.tsx`, `src/pages/technician/Dashboard.tsx` | `useUpdateBookingStatus()` | `/api/bookings/:id/status` | `PATCH` | Customer / Technician | Updates booking status (ACCEPT, CANCEL, COMPLETED). |

---

## 5. Payments & Checkout

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/Payment.tsx` | `useCreatePayment()` | `/api/payments/create` | `POST` | Customer | Initiates Stripe PaymentIntent for an accepted booking. |
| Backend Webhook | N/A | `/api/payments/webhook` | `POST` | Stripe Signature | Processes automated Stripe payment confirmation events. |

---

## 6. Reviews & Ratings

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/TechnicianProfile.tsx` | `useTechnicianReviews()` | `/api/reviews/technician/:id` | `GET` | Public | Fetches reviews for a technician. |
| `src/pages/customer/Dashboard.tsx` | `useCreateReview()` | `/api/reviews` | `POST` | Customer | Allows customer to review a completed booking. |

---

## 7. Wallet & Financial History

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/Wallet.tsx` | `useWallet()` | `/api/wallet` | `GET` | Bearer Token | Fetches user wallet balance and statistics. |
| `src/pages/Wallet.tsx` | `useAddMoney()` | `/api/wallet/add` | `POST` | Bearer Token | Adds funds to user wallet balance. |
| `src/pages/Wallet.tsx` | `useWalletTransactions()` | `/api/wallet/transactions` | `GET` | Bearer Token | Lists wallet deposit & expense history. |

---

## 8. Notifications

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/notifications/NotificationCenter.tsx` | `useNotifications()` | `/api/notifications` | `GET` | Bearer Token | Fetches all notifications for the user. |
| `src/pages/notifications/NotificationCenter.tsx` | `useMarkNotificationRead()` | `/api/notifications/:id/read` | `PATCH` | Bearer Token | Marks single notification as read. |
| `src/pages/notifications/NotificationCenter.tsx` | `useMarkAllNotificationsRead()` | `/api/notifications/read-all` | `PATCH` | Bearer Token | Marks all notifications as read. |

---

## 9. Administrator Controls

| Frontend Component / Page | Custom Hook | Backend Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- | --- |
| `src/pages/admin/Dashboard.tsx` | `useAdminStats()` | `/api/admin/stats` | `GET` | Admin | Fetches system metrics (revenue, total users, bookings). |
| `src/pages/admin/Users.tsx` | `useAdminUsers()` | `/api/admin/users` | `GET` | Admin | Lists all registered users. |
| `src/pages/admin/Users.tsx` | `useAdminBanUser()` | `/api/admin/users/:id/ban` | `PATCH` | Admin | Bans or unbans a user account. |
| `src/pages/admin/Bookings.tsx` | `useAdminBookings()` | `/api/admin/bookings` | `GET` | Admin | Views all bookings across the platform. |
| `src/pages/admin/Categories.tsx` | `useAdminCategories()` | `/api/admin/categories` | `GET` | Admin | Lists categories and service stats. |

---

## 10. Consistent UI Error Handling & Response Mapping

All API endpoints return standard HTTP status codes handled uniformly by the frontend:
- **`200 / 201`**: Processed successfully. Succeeded mutations trigger React Query cache invalidations and toast alerts.
- **`400 Bad Request`**: Validation errors return Zod schema error fields, displayed inline in forms or via error Toast notifications.
- **`401 Unauthorized`**: Automatically clears token, resets `AuthContext`, and redirects to `/login`.
- **`403 Forbidden`**: Displays an `Unauthorized` access fallback page.
- **`404 Not Found`**: Renders `NotFound.tsx` or inline missing entity state.
- **`500 Server Error`**: Caught by Axios global interceptor and caught by `ErrorBoundary` to prevent blank screen crashes.
