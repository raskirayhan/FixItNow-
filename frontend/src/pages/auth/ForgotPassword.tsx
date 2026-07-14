import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, ArrowLeft, ArrowRight, CheckCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const { isDark } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setSubmittedEmail(data.email);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
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
                  No worries, we&apos;ll send you a reset code to get back into your account.
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

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Reset Code
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
                  Check Your Email
                </h2>
                <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  We&apos;ve sent a password reset code to
                </p>
                <p className="mt-1 text-sm font-medium text-primary-600">{submittedEmail}</p>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setIsSuccess(false);
                    setSubmittedEmail("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Open Email App
                  </div>
                </Button>
                <Link to="/reset-password" className="block w-full">
                  <Button type="button" variant="outline" className="w-full" size="lg">
                    Enter Reset Code
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Didn&apos;t receive the email?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setSubmittedEmail("");
                    }}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
