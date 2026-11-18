import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, ArrowLeft, ArrowRight, CheckCircle, Wrench, PackageCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useSendOtp } from "@/hooks/useApi";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [courierOtp, setCourierOtp] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sendOtpMutation = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      setSubmittedEmail(data.email);
      const res = await sendOtpMutation.mutateAsync({
        email: data.email,
        purpose: "Password Reset & Account Security",
      });

      const responseData = res?.data || res;
      const otpCode = responseData?.demoOtp;
      const trackId = responseData?.trackingId || `CR-${Date.now().toString(36).toUpperCase()}`;

      sessionStorage.setItem("fixitnow_otp_email", data.email);
      if (otpCode) {
        sessionStorage.setItem("fixitnow_demo_otp", otpCode);
        setCourierOtp(otpCode);
      }
      setTrackingId(trackId);

      toastSuccess(
        "Courier OTP Dispatched",
        `Verification code sent to ${data.email}. Tracking ID: ${trackId}`
      );
      setIsSuccess(true);
    } catch (err: any) {
      toastError(
        "Dispatch Failed",
        err?.response?.data?.message || "Failed to send verification code. Please try again."
      );
    }
  };

  const copyOtp = () => {
    if (courierOtp) {
      navigator.clipboard.writeText(courierOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-12",
        isDark ? "bg-slate-950" : "bg-slate-50"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            FixItNow
          </span>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-8 shadow-lg",
            isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
          )}
        >
          {!isSuccess ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl",
                    isDark ? "bg-slate-800" : "bg-primary-50"
                  )}
                >
                  <Lock className="h-8 w-8 text-primary-600" />
                </div>
                <h1
                  className={cn(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Forgot Password?
                </h1>
                <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Enter your email address to receive an instant Courier Service OTP verification code.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button type="submit" className="w-full" size="lg" disabled={sendOtpMutation.isPending}>
                  {sendOtpMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Dispatching OTP...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Verification OTP
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  to="/login"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                </motion.div>
                <h2
                  className={cn(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Courier OTP Sent!
                </h2>
                <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  We dispatched a 6-digit security code to:
                </p>
                <p className="mt-0.5 text-sm font-semibold text-primary-600">{submittedEmail}</p>
              </div>

              {/* Courier Delivery Card */}
              {courierOtp && (
                <div
                  className={cn(
                    "rounded-xl border p-4 text-center",
                    isDark ? "border-primary-900/50 bg-primary-950/40" : "border-primary-100 bg-primary-50/70"
                  )}
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                    <PackageCheck className="h-4 w-4" />
                    Courier Service OTP Notification
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl font-extrabold tracking-widest text-primary-700 dark:text-primary-300">
                      {courierOtp}
                    </span>
                    <button
                      type="button"
                      onClick={copyOtp}
                      className="rounded-lg border border-primary-200 bg-white p-1.5 text-primary-600 shadow-sm hover:bg-primary-50 dark:border-primary-800 dark:bg-slate-800 dark:text-primary-300"
                      title="Copy OTP"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Ref ID: <span className="font-mono">{trackingId}</span> &bull; Valid for 10 minutes
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => navigate("/verify-otp")}
                >
                  Enter Verification Code
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setIsSuccess(false);
                    setSubmittedEmail("");
                    setCourierOtp(null);
                  }}
                >
                  Send to Another Email
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
