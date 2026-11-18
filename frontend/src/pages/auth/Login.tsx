import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Clock,
  Star,
  Wrench,
  PackageCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { useSendOtp } from "@/hooks/useApi";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  { icon: Shield, text: "Verified & background-checked technicians" },
  { icon: Clock, text: "Same-day bookings available" },
  { icon: Star, text: "Rated 4.9/5 by thousands of customers" },
];

export default function Login() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const { login, loginWithOtp } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Login States
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const sendOtpMutation = useSendOtp();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleRoleRedirect = (role?: string) => {
    const target = role === "ADMIN" ? "/admin" : role === "TECHNICIAN" ? "/technician" : "/customer";
    navigate(target, { replace: true });
    setTimeout(() => {
      if (window.location.pathname === "/login") {
        window.location.href = target;
      }
    }, 150);
  };

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (result) {
        toastSuccess("Welcome Back", "Logged in successfully.");
        const userRole = result?.role || (typeof result === "object" ? result.role : undefined);
        handleRoleRedirect(userRole);
      } else {
        toastError("Login Failed", "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      let msg = err?.response?.data?.message;
      if (!msg) {
        if (err.message === "Network Error" || err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
          msg = "Network connection failed. The backend server may be warming up (Render cold start) or offline. Please wait 15 seconds and try again.";
        } else {
          msg = err.message || "Invalid credentials. Please check your email and password.";
        }
      }
      toastError("Login Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendLoginOtp = async () => {
    if (!otpEmail || !otpEmail.includes("@")) {
      toastError("Invalid Email", "Please enter a valid email address to receive Courier OTP.");
      return;
    }
    try {
      const res = await sendOtpMutation.mutateAsync({
        email: otpEmail,
        purpose: "Instant Courier Fast Login",
      });
      const data = res?.data || res;
      if (data?.demoOtp) {
        setDispatchedOtp(data.demoOtp);
        setOtpCode(data.demoOtp); // Convenient auto-fill for testing
      }
      toastSuccess("Courier OTP Dispatched", `A 6-digit login code has been dispatched to ${otpEmail}.`);
    } catch (err: any) {
      toastError("Dispatch Error", err?.response?.data?.message || "Could not dispatch OTP.");
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail || otpCode.length !== 6) {
      toastError("Missing Fields", "Please provide email and 6-digit OTP code.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await loginWithOtp(otpEmail, otpCode);
      if (result) {
        toastSuccess("Instant Access", "Logged in successfully via Courier OTP.");
        const userRole = result?.role || (typeof result === "object" ? result.role : undefined);
        handleRoleRedirect(userRole);
      }
    } catch (err: any) {
      toastError("OTP Login Failed", err?.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (email: string, pass: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    setOtpEmail(email);
  };

  return (
    <div className={cn("flex min-h-screen", isDark ? "bg-slate-950" : "bg-white")}>
      {/* Left Side - Brand */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FixItNow</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white">
                Welcome back to
                <br />
                FixItNow
              </h1>
              <p className="text-lg text-primary-100">
                Your trusted marketplace for finding, booking, and managing verified local home services.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary-50">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm text-primary-200"
          >
            &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              FixItNow
            </span>
          </div>

          <div className="space-y-1">
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Sign In
            </h2>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Choose your preferred sign in method below
            </p>
          </div>

          {/* Login Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setLoginMode("password")}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200",
                loginMode === "password"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("otp")}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5",
                loginMode === "otp"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              <PackageCheck className="h-3.5 w-3.5 text-primary-600" />
              Courier OTP Login
            </button>
          </div>

          {/* Quick Credential Test Pills */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              ⚡ Quick 1-Click Test Accounts:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillQuickCredentials("admin@fixitnow.com", "password123")}
                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                Admin (Full Access)
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials("tech1@test.com", "password123")}
                className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Technician (Workstation)
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials("customer1@test.com", "password123")}
                className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
              >
                Customer (Booking)
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loginMode === "password" ? (
              <motion.form
                key="password-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    icon={<Lock className="h-4 w-4" />}
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <Checkbox label="Remember me" />
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleOtpLogin}
                className="space-y-4"
              >
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 text-xs shrink-0 font-semibold"
                    onClick={handleSendLoginOtp}
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Dispatch OTP"}
                  </Button>
                </div>

                {dispatchedOtp && (
                  <div className="rounded-lg border border-primary-200 bg-primary-50 p-2 text-center dark:border-primary-900/40 dark:bg-primary-950/30">
                    <p className="text-xs text-primary-700 dark:text-primary-300">
                      Courier Code Delivered: <strong>{dispatchedOtp}</strong>
                    </p>
                  </div>
                )}

                <div>
                  <Input
                    label="6-Digit Verification Code"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    icon={<Zap className="h-4 w-4" />}
                    maxLength={6}
                  />
                </div>

                <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting || otpCode.length !== 6}>
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Verify & Sign In Instantly
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className={cn("text-center text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create an Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
