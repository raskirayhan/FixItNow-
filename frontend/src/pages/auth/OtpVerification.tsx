import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, ArrowLeft, CheckCircle, Wrench, PackageCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useVerifyOtp, useSendOtp } from "@/hooks/useApi";

const otpSchema = z.object({
  digits: z
    .array(z.string().regex(/^\d$/, "Must be a digit"))
    .length(6, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof otpSchema>;

export default function OtpVerification() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState(() => sessionStorage.getItem("fixitnow_otp_email") || "you@example.com");
  const [cachedOtp, setCachedOtp] = useState<string | null>(() => sessionStorage.getItem("fixitnow_demo_otp"));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtpMutation = useVerifyOtp();
  const sendOtpMutation = useSendOtp();

  const {
    setValue,
    formState: { errors },
    watch,
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { digits: ["", "", "", "", "", ""] },
  });

  const digits = watch("digits");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const digit = value.slice(-1);
      const newDigits = [...digits];
      newDigits[index] = digit;
      setValue("digits", newDigits, { shouldValidate: true });

      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, setValue]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setValue("digits", newDigits);
      }
    },
    [digits, setValue]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (pasted.length === 0) return;
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || "";
      }
      setValue("digits", newDigits, { shouldValidate: true });
      const nextEmpty = newDigits.findIndex((d) => !d);
      inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    },
    [digits, setValue]
  );

  const fillCourierOtp = () => {
    if (!cachedOtp || cachedOtp.length !== 6) return;
    const newDigits = cachedOtp.split("");
    setValue("digits", newDigits, { shouldValidate: true });
  };

  const handleVerify = async () => {
    const otpCode = digits.join("");
    if (otpCode.length !== 6) return;

    try {
      await verifyOtpMutation.mutateAsync({ email, otp: otpCode });
      sessionStorage.setItem("fixitnow_verified_otp", otpCode);
      toastSuccess("OTP Verified", "Your verification code was accepted successfully.");
      setIsSuccess(true);
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err: any) {
      toastError(
        "Verification Failed",
        err?.response?.data?.message || "Invalid or expired OTP code. Please check and try again."
      );
    }
  };

  const handleResend = async () => {
    try {
      const res = await sendOtpMutation.mutateAsync({ email, purpose: "Resend Code" });
      const responseData = res?.data || res;
      if (responseData?.demoOtp) {
        sessionStorage.setItem("fixitnow_demo_otp", responseData.demoOtp);
        setCachedOtp(responseData.demoOtp);
      }
      setCountdown(60);
      setCanResend(false);
      toastSuccess("OTP Resent", "A new Courier Service verification code has been dispatched.");
    } catch (err: any) {
      toastError("Resend Failed", err?.response?.data?.message || "Could not resend OTP.");
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
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <h1
                  className={cn(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Verify Courier OTP
                </h1>
                <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Enter the 6-digit security code sent to:
                </p>
                <p className="font-semibold text-primary-600 text-sm mt-0.5">{email}</p>
              </div>

              {/* Courier Hint Box */}
              {cachedOtp && (
                <div
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 text-xs",
                    isDark ? "border-primary-900/40 bg-primary-950/30 text-primary-300" : "border-primary-200 bg-primary-50/70 text-primary-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-4 w-4 shrink-0" />
                    <span>Courier OTP Dispatched: <strong>{cachedOtp}</strong></span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-semibold gap-1 text-primary-700 hover:text-primary-800 hover:bg-primary-100"
                    onClick={fillCourierOtp}
                  >
                    <Zap className="h-3 w-3" />
                    Auto-Fill
                  </Button>
                </div>
              )}

              <div className="flex justify-center gap-2">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={cn(
                      "h-14 w-12 rounded-xl border text-center text-xl font-bold transition-all duration-200",
                      "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                      digit
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : isDark
                          ? "border-slate-700 bg-slate-800 text-white"
                          : "border-slate-200 bg-white text-slate-900"
                    )}
                  />
                ))}
              </div>
              {errors.digits && (
                <p className="text-center text-xs text-red-500">
                  {errors.digits.message || "Please enter all 6 digits"}
                </p>
              )}

              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={handleVerify}
                disabled={verifyOtpMutation.isPending || digits.some((d) => !d)}
              >
                {verifyOtpMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying with Courier API...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={sendOtpMutation.isPending}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Resend Courier Code"}
                  </button>
                ) : (
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    Resend code in{" "}
                    <span className="font-semibold text-primary-600">{countdown}s</span>
                  </p>
                )}
              </div>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change email address
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center space-y-4 py-4 text-center"
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
                OTP Verified!
              </h2>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Authentication confirmed. Redirecting to set new password...
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
