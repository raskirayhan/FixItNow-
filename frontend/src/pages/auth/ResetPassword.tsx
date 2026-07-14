import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Key, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 1) return { score: 20, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 40, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score: 60, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score: 80, label: "Strong", color: "bg-primary-500" };
  return { score: 100, label: "Very Strong", color: "bg-emerald-500" };
}

export default function ResetPassword() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const watchedPassword = watch("password") || "";
  const passwordStrength = getPasswordStrength(watchedPassword);

  const onSubmit = async (_data: ResetForm) => {
    setIsLoading(true);
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
                  <Key className="h-8 w-8 text-primary-600" />
                </div>
                <h1
                  className={cn(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Reset Password
                </h1>
                <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Create a new strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
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

                {watchedPassword && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Password strength</span>
                      <span
                        className={cn(
                          "font-medium",
                          passwordStrength.score <= 40
                            ? "text-red-500"
                            : passwordStrength.score <= 60
                              ? "text-yellow-600"
                              : "text-emerald-600"
                        )}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength.score}
                      className="h-1.5"
                      indicatorClassName={passwordStrength.color}
                    />
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    icon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Resetting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Reset Password
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
              className="flex flex-col items-center space-y-4 py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
              >
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </motion.div>
              <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                Password Reset!
              </h2>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Your password has been successfully reset.
              </p>
              <Button
                type="button"
                className="mt-4"
                size="lg"
                onClick={() => navigate("/login")}
              >
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
