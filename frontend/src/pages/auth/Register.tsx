import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Wrench,
  UserCheck,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";

const registerSchema = z
  .object({
    role: z.enum(["CUSTOMER", "TECHNICIAN"], { message: "Please select a role" }),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    location: z.string().optional(),
    agreeToTerms: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const steps = ["Role", "Details", "Security", "Finish"];

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

export default function Register() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const { error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: undefined },
  });

  const watchedPassword = watch("password") || "";
  const watchedRole = watch("role");
  const passwordStrength = getPasswordStrength(watchedPassword);

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterForm)[] = [];
    if (currentStep === 0) fieldsToValidate = ["role"];
    if (currentStep === 1) fieldsToValidate = ["name", "email"];
    if (currentStep === 2) fieldsToValidate = ["password", "confirmPassword"];

    const valid = await trigger(fieldsToValidate);
    if (valid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      const success = await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        location: data.location,
        role: data.role,
      });
      if (success) {
        navigate("/");
      } else {
        toastError("Registration Failed", "Could not create account. Please try again.");
      }
    } catch (err: any) {
      toastError("Registration Failed", err?.response?.data?.message || "Could not create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                Join thousands
                <br />
                of happy
                <br />
                homeowners
              </h1>
              <p className="text-lg text-primary-100">
                Create your account and get access to verified professionals in minutes.
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">10k+</p>
                <p className="text-sm text-primary-200">Customers</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-primary-200">Technicians</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">20k+</p>
                <p className="text-sm text-primary-200">Jobs Done</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm text-primary-200"
          >
            &copy; 2026 FixItNow. All rights reserved.
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
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              FixItNow
            </span>
          </div>

          <div className="space-y-2">
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Create Account
            </h2>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Get started with FixItNow today
            </p>
          </div>

          {/* Step Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                {steps[currentStep]}
              </span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {/* Step 0: Role Selection */}
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}
                  >
                    I want to:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("role", "CUSTOMER", { shouldValidate: true })}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all",
                        watchedRole === "CUSTOMER"
                          ? "border-primary-600 bg-primary-50"
                          : isDark
                            ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          watchedRole === "CUSTOMER"
                            ? "bg-primary-100 text-primary-600"
                            : isDark
                              ? "bg-slate-700 text-slate-400"
                              : "bg-slate-100 text-slate-400"
                        )}
                      >
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isDark ? "text-white" : "text-slate-900"
                          )}
                        >
                          I need a service
                        </p>
                        <p className="text-xs text-slate-500">Find professionals</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "TECHNICIAN", { shouldValidate: true })}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all",
                        watchedRole === "TECHNICIAN"
                          ? "border-primary-600 bg-primary-50"
                          : isDark
                            ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          watchedRole === "TECHNICIAN"
                            ? "bg-primary-100 text-primary-600"
                            : isDark
                              ? "bg-slate-700 text-slate-400"
                              : "bg-slate-100 text-slate-400"
                        )}
                      >
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isDark ? "text-white" : "text-slate-900"
                          )}
                        >
                          I provide services
                        </p>
                        <p className="text-xs text-slate-500">Offer your skills</p>
                      </div>
                    </button>
                  </div>
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role.message}</p>
                  )}
                </motion.div>
              )}

              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    icon={<User className="h-4 w-4" />}
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Input
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    icon={<Phone className="h-4 w-4" />}
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="Location (optional)"
                    placeholder="City, State"
                    icon={<MapPin className="h-4 w-4" />}
                    error={errors.location?.message}
                    {...register("location")}
                  />
                </motion.div>
              )}

              {/* Step 2: Security */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        icon={<Lock className="h-4 w-4" />}
                        error={errors.password?.message}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {watchedPassword && (
                      <div className="mt-2 space-y-1">
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
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
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
                </motion.div>
              )}

              {/* Step 3: Finish */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div
                    className={cn(
                      "rounded-xl border p-4",
                      isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                          Account Type
                        </span>
                        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {watchedRole === "CUSTOMER" ? "Customer" : "Technician"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                          Email
                        </span>
                        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {watch("email")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Checkbox
                    label="I agree to the Terms of Service and Privacy Policy"
                    checked={watch("agreeToTerms") === true}
                    onCheckedChange={(checked) =>
                      setValue("agreeToTerms", checked === true ? true : (false as any), { shouldValidate: true })
                    }
                  />
                  {errors.agreeToTerms && (
                    <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep} className="flex-1">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Create Account
                    </div>
                  )}
                </Button>
              )}
            </div>
          </form>

          <p className={cn("text-center text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
