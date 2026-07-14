import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/shared/CookieConsent";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Landing from "@/pages/Landing";
import Services from "@/pages/Services";
import TechnicianProfile from "@/pages/TechnicianProfile";
import Booking from "@/pages/Booking";
import Payment from "@/pages/Payment";
import Wallet from "@/pages/Wallet";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import OtpVerification from "@/pages/auth/OtpVerification";
import ResetPassword from "@/pages/auth/ResetPassword";

// Dashboard Pages
import CustomerDashboard from "@/pages/customer/Dashboard";
import TechnicianDashboard from "@/pages/technician/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminTechnicians from "@/pages/admin/Technicians";
import AdminBookings from "@/pages/admin/Bookings";
import AdminCategories from "@/pages/admin/Categories";
import AdminPayments from "@/pages/admin/Payments";
import AdminReviews from "@/pages/admin/Reviews";
import AdminReports from "@/pages/admin/Reports";

// Profile & Notifications
import Profile from "@/pages/profile/Profile";
import NotificationCenter from "@/pages/notifications/NotificationCenter";

// Extra Pages
import About from "@/pages/extra/About";
import Contact from "@/pages/extra/Contact";
import Blog from "@/pages/extra/Blog";
import Careers from "@/pages/extra/Careers";
import Privacy from "@/pages/extra/Privacy";
import Terms from "@/pages/extra/Terms";
import NotFound from "@/pages/extra/NotFound";
import Maintenance from "@/pages/extra/Maintenance";

function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You don't have permission to access this page.</p>
        <a href="/" className="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes with Navbar + Footer */}
              <Route path="/" element={<><Navbar /><Landing /><Footer /></>} />
              <Route path="/services" element={<><Navbar /><Services /><Footer /></>} />
              <Route path="/services/:technicianId" element={<><Navbar /><TechnicianProfile /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
              <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
              <Route path="/careers" element={<><Navbar /><Careers /><Footer /></>} />
              <Route path="/privacy" element={<><Navbar /><Privacy /><Footer /></>} />
              <Route path="/terms" element={<><Navbar /><Terms /><Footer /></>} />
              <Route path="/maintenance" element={<><Navbar /><Maintenance /><Footer /></>} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<><Navbar /><Unauthorized /></>} />

              {/* Protected Routes (no footer) */}
              <Route path="/booking/:serviceId" element={<ProtectedRoute><><Navbar /><Booking /></></ProtectedRoute>} />
              <Route path="/payment/:bookingId" element={<ProtectedRoute><><Navbar /><Payment /></></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><><Navbar /><Wallet /></></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><><Navbar /><Profile /></></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><><Navbar /><NotificationCenter /></></ProtectedRoute>} />

              {/* Customer Dashboard */}
              <Route path="/customer" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/customer/:tab" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><CustomerDashboard /></ProtectedRoute>} />

              {/* Technician Dashboard */}
              <Route path="/technician" element={<ProtectedRoute allowedRoles={["TECHNICIAN"]}><TechnicianDashboard /></ProtectedRoute>} />
              <Route path="/technician/:tab" element={<ProtectedRoute allowedRoles={["TECHNICIAN"]}><TechnicianDashboard /></ProtectedRoute>} />

              {/* Admin Dashboard */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/technicians" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminTechnicians /></ProtectedRoute>} />
              <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminBookings /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminCategories /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminReviews /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminReports /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <CookieConsent />
        </div>
    </BrowserRouter>
  );
}
