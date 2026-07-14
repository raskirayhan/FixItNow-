import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Shield,
  Building2,
  Banknote,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  ArrowLeft,
  Home,
  Tag,
  ChevronRight,
  FileText,
  Lock,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Receipt,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useCreatePayment, useWallet } from "@/hooks/useApi";
import { toast } from "@/components/ui/toast";
import { transactions } from "@/mock/data";
import type { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedCard from "@/components/shared/AnimatedCard";
import PageHeader from "@/components/shared/PageHeader";

type PaymentStatus = "idle" | "processing" | "success" | "failed" | "pending";
type PaymentMethodType = "stripe" | "sslcommerz" | "cod" | "wallet";

const banks = [
  "Dutch-Bangla Bank",
  "BRAC Bank",
  "Eastern Bank",
  "ICB Islamic Bank",
  "Mutual Trust Bank",
  "Premier Bank",
  "Pubali Bank",
  "Sonali Bank",
  "AB Bank",
  "Bangladesh Bank",
];

const statusBadge: Record<string, { variant: "success" | "warning" | "destructive" | "info" | "default" }> = {
  COMPLETED: { variant: "success" },
  PENDING: { variant: "warning" },
  FAILED: { variant: "destructive" },
};

export default function Payment() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const queryClient = useQueryClient();

  const walletQuery = useWallet();
  const createPayment = useCreatePayment();
  const walletData = walletQuery.data?.data || { balance: 0, pendingAmount: 0, totalEarned: 0, totalSpent: 0, transactions: [], coupons: [], rewards: [] };

  let booking: Booking | null = null as Booking | null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("stripe");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [codAgreed, setCodAgreed] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [walletPayLoading, setWalletPayLoading] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  const subtotal = booking?.totalAmount ?? 150;
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.15 * 100) / 100 : 0;
  const total = subtotal + platformFee - discountAmount;

  const technicianName = booking?.technician?.user?.name ?? "James Wilson";
  const serviceName = booking?.service?.title ?? "Emergency Pipe Repair";
  const scheduledDate = booking?.scheduledAt ?? "2026-07-20T10:00:00Z";
  const timeSlot = booking?.timeSlot ?? "10:00 AM - 12:00 PM";
  const address = booking?.address ?? "123 Maple Ave, Brooklyn, NY 11201";

  const recentTransactions = useMemo(
    () => transactions.slice(0, 6),
    []
  );

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "visa";
    if (clean.startsWith("5") || clean.startsWith("2"))
      return "mastercard";
    return null;
  };

  const cardBrand = getCardBrand(cardNumber);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SUMMER2026" || couponCode.toUpperCase() === "CLEAN25") {
      setCouponApplied(true);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === "stripe" && bookingId) {
      setPaymentStatus("processing");
      try {
        await createPayment.mutateAsync({ bookingId });
        queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
        setPaymentStatus("success");
      } catch (error: any) {
        setPaymentStatus("failed");
        toast({ title: "Payment Failed", description: error?.response?.data?.message || "Payment processing failed.", variant: "error" });
      }
    } else {
      setPaymentStatus("processing");
      setTimeout(() => {
        if (paymentMethod === "cod") {
          setPaymentStatus("pending");
        } else {
          setPaymentStatus("success");
        }
      }, 2500);
    }
  };

  const handleWalletPay = () => {
    setWalletPayLoading(true);
    setPaymentStatus("processing");
    setTimeout(() => {
      setWalletPayLoading(false);
      setPaymentStatus("success");
    }, 2000);
  };

  const resetPayment = () => {
    setPaymentStatus("idle");
    setCouponCode("");
    setCouponApplied(false);
    setCodAgreed(false);
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
    setSelectedBank("");
  };

  const copyReceiptId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedReceipt(id);
    setTimeout(() => setCopiedReceipt(null), 2000);
  };

  if (paymentStatus === "success") {
    return (
      <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className={cn("mt-6 text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Payment Successful!
            </h1>
            <p className={cn("mt-2 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Your booking has been confirmed and payment processed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={cn(
              "mx-auto mt-8 max-w-md rounded-2xl border p-6 text-left",
              isDark
                ? "border-slate-700/50 bg-slate-800/80"
                : "border-slate-200 bg-white"
            )}
          >
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
              Transaction Details
            </h3>
            <Separator className="my-3" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Service</span>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Technician</span>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{technicianName}</span>
              </div>
              <div className="flex justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Amount Paid</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Payment Method</span>
                <span className={cn("text-sm font-medium capitalize", isDark ? "text-white" : "text-slate-900")}>{paymentMethod === "sslcommerz" ? "SSLCommerz" : paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Transaction ID</span>
                <span className={cn("font-mono text-xs", isDark ? "text-slate-300" : "text-slate-600")}>TXN-{Date.now().toString(36).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button className="gap-2" onClick={() => window.print()}>
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <XCircle className="h-12 w-12 text-red-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className={cn("mt-6 text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Payment Failed
            </h1>
            <p className={cn("mt-2 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              We couldn't process your payment. Please try again.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={cn(
              "mx-auto mt-6 max-w-md rounded-xl border p-4",
              "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20"
            )}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Error Details</p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                  Your card was declined. Please check your card details or try a different payment method.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button className="gap-2" onClick={resetPayment}>
              <CreditCard className="h-4 w-4" />
              Try Again
            </Button>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <Clock className="h-12 w-12 text-amber-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={cn("mt-6 text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Payment Pending
            </h1>
            <p className={cn("mt-2 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              We're processing your payment. You'll receive a confirmation shortly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={cn(
              "mx-auto mt-6 max-w-md rounded-xl border p-4",
              "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20"
            )}
          >
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Cash on Delivery: Pay {formatCurrency(total)} to the technician upon service completion.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "processing") {
    return (
      <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-primary-500" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn("mt-6 text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}
          >
            Processing Payment...
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("mt-2", isDark ? "text-slate-400" : "text-slate-500")}
          >
            Please don't close this page.
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Checkout"
          subtitle="Review your booking and complete payment"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Bookings", href: "/bookings" },
            { label: "Payment", href: "/payment" },
          ]}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Left: Payment Methods */}
          <div className="space-y-6 lg:col-span-3">
            <AnimatedCard delay={0.1}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <CreditCard className="h-5 w-5 text-primary-500" />
                    Payment Method
                  </CardTitle>
                  <CardDescription className={cn(isDark ? "text-slate-400" : "")}>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethodType)}
                    className="space-y-3"
                  >
                    {/* Stripe */}
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200",
                        paymentMethod === "stripe"
                          ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                          : isDark
                            ? "border-slate-700 hover:border-slate-600"
                            : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <RadioGroupItem value="stripe" />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#635BFF]/10">
                            <CreditCard className="h-5 w-5 text-[#635BFF]" />
                          </div>
                          <div>
                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>Credit / Debit Card</p>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Powered by Stripe</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-7 w-11 rounded bg-[#1A1F71] flex items-center justify-center">
                            <span className="text-[8px] font-bold text-white tracking-wider">VISA</span>
                          </div>
                          <div className="h-7 w-11 rounded bg-[#EB001B] flex items-center justify-center">
                            <div className="flex -space-x-1.5">
                              <div className="h-4 w-4 rounded-full bg-[#EB001B]" />
                              <div className="h-4 w-4 rounded-full bg-[#F79E1B] opacity-80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* SSLCommerz */}
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200",
                        paymentMethod === "sslcommerz"
                          ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                          : isDark
                            ? "border-slate-700 hover:border-slate-600"
                            : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <RadioGroupItem value="sslcommerz" />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1AAB55]/10">
                            <Building2 className="h-5 w-5 text-[#1AAB55]" />
                          </div>
                          <div>
                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>SSLCommerz</p>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Bank transfer & mobile banking</p>
                          </div>
                        </div>
                        <Shield className="h-5 w-5 text-[#1AAB55]" />
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200",
                        paymentMethod === "cod"
                          ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                          : isDark
                            ? "border-slate-700 hover:border-slate-600"
                            : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <RadioGroupItem value="cod" />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Banknote className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>Cash on Delivery</p>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Pay when service is completed</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Wallet */}
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200",
                        paymentMethod === "wallet"
                          ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                          : isDark
                            ? "border-slate-700 hover:border-slate-600"
                            : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <RadioGroupItem value="wallet" />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>Wallet Balance</p>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Available: {formatCurrency(walletData.balance)}</p>
                          </div>
                        </div>
                        {walletData.balance >= total ? (
                          <Badge variant="success" className="text-[10px]">Sufficient</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">Insufficient</Badge>
                        )}
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Stripe Form */}
            <AnimatePresence mode="wait">
              {paymentMethod === "stripe" && (
                <motion.div
                  key="stripe"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCard delay={0.2}>
                    <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                      <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                          <Lock className="h-5 w-5 text-primary-500" />
                          Card Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                            Card Number
                          </label>
                          <div className="relative">
                            <Input
                              placeholder="XXXX XXXX XXXX XXXX"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              className={cn("pr-20", isDark ? "border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500" : "")}
                              maxLength={19}
                            />
                            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                              {cardBrand === "visa" && (
                                <div className="h-6 w-9 rounded bg-[#1A1F71] flex items-center justify-center">
                                  <span className="text-[7px] font-bold text-white">VISA</span>
                                </div>
                              )}
                              {cardBrand === "mastercard" && (
                                <div className="h-6 w-9 rounded bg-[#EB001B] flex items-center justify-center">
                                  <div className="flex -space-x-1">
                                    <div className="h-3 w-3 rounded-full bg-[#EB001B]" />
                                    <div className="h-3 w-3 rounded-full bg-[#F79E1B] opacity-80" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                              Expiry Date
                            </label>
                            <Input
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                              className={cn(isDark ? "border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500" : "")}
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                              CVC
                            </label>
                            <Input
                              placeholder="123"
                              type="password"
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              className={cn(isDark ? "border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500" : "")}
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-primary-50 p-3 dark:bg-primary-900/20">
                          <Lock className="h-4 w-4 shrink-0 text-primary-500" />
                          <p className="text-xs text-primary-700 dark:text-primary-300">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>

                        <Button
                          className="w-full gap-2"
                          size="lg"
                          onClick={handlePayment}
                          disabled={!cardNumber || cardNumber.replace(/\s/g, "").length < 16 || !expiryDate || expiryDate.length < 5 || !cvc || cvc.length < 3}
                        >
                          <Lock className="h-4 w-4" />
                          Pay {formatCurrency(total)}
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>
              )}

              {paymentMethod === "sslcommerz" && (
                <motion.div
                  key="sslcommerz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCard delay={0.2}>
                    <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                      <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                          <Building2 className="h-5 w-5 text-[#1AAB55]" />
                          SSLCommerz Payment
                        </CardTitle>
                        <CardDescription className={cn(isDark ? "text-slate-400" : "")}>
                          Select your bank to continue with secure payment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                            Select Bank
                          </label>
                          <Select value={selectedBank} onValueChange={setSelectedBank}>
                            <SelectTrigger className={cn(isDark ? "border-slate-600 bg-slate-700/50 text-white" : "")}>
                              <SelectValue placeholder="Choose your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              {banks.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                          <Shield className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            SSLCommerz uses 256-bit SSL encryption. Your banking information is fully secured.
                          </p>
                        </div>

                        <Button
                          className="w-full gap-2 bg-[#1AAB55] hover:bg-[#158F44]"
                          size="lg"
                          onClick={handlePayment}
                          disabled={!selectedBank}
                        >
                          <Shield className="h-4 w-4" />
                          Pay with SSLCommerz
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>
              )}

              {paymentMethod === "cod" && (
                <motion.div
                  key="cod"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCard delay={0.2}>
                    <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                      <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                          <Banknote className="h-5 w-5 text-amber-500" />
                          Cash on Delivery
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className={cn("rounded-xl border p-4", isDark ? "border-slate-600 bg-slate-700/30" : "border-slate-200 bg-slate-50")}>
                          <div className="flex items-start gap-3">
                            <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                            <div className="space-y-2">
                              <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                How Cash on Delivery Works
                              </p>
                              <ul className={cn("space-y-1.5 text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                                <li className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                                  Confirm your order now without any upfront payment
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                                  Pay {formatCurrency(total)} directly to the technician upon service completion
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                                  Cash, mobile money, or card payments accepted on-site
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Checkbox
                          label="I agree to pay the total amount on delivery"
                          checked={codAgreed}
                          onCheckedChange={(v) => setCodAgreed(v === true)}
                        />

                        <Button
                          className="w-full gap-2"
                          size="lg"
                          onClick={handlePayment}
                          disabled={!codAgreed}
                        >
                          <Banknote className="h-4 w-4" />
                          Confirm Order
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>
              )}

              {paymentMethod === "wallet" && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCard delay={0.2}>
                    <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                      <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                          <Wallet className="h-5 w-5 text-emerald-500" />
                          Pay from Wallet
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className={cn(
                          "rounded-xl border p-4",
                          walletData.balance >= total
                            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20"
                            : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20"
                        )}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Available Balance</p>
                              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                                {formatCurrency(walletData.balance)}
                              </p>
                            </div>
                            {walletData.balance >= total ? (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                                <XCircle className="h-6 w-6 text-red-500" />
                              </div>
                            )}
                          </div>
                          {walletData.balance < total && (
                            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                              You need {formatCurrency(total - walletData.balance)} more to complete this payment.
                            </p>
                          )}
                        </div>

                        <div className={cn("rounded-lg p-3", isDark ? "bg-slate-700/30" : "bg-slate-50")}>
                          <div className="flex justify-between text-sm">
                            <span className={cn(isDark ? "text-slate-400" : "text-slate-500")}>Payment amount</span>
                            <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(total)}</span>
                          </div>
                          <div className="mt-1 flex justify-between text-sm">
                            <span className={cn(isDark ? "text-slate-400" : "text-slate-500")}>After payment</span>
                            <span className={cn("font-medium", walletData.balance >= total ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                              {formatCurrency(walletData.balance - total)}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full gap-2"
                          size="lg"
                          onClick={handleWalletPay}
                          disabled={walletData.balance < total || walletPayLoading}
                        >
                          {walletPayLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Wallet className="h-4 w-4" />
                          )}
                          {walletPayLoading ? "Processing..." : `Pay ${formatCurrency(total)}`}
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transaction History */}
            <AnimatedCard delay={0.3}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Receipt className="h-5 w-5 text-primary-500" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((txn, idx) => (
                      <motion.div
                        key={txn.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-3 transition-colors",
                          isDark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            txn.type === "credit"
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          )}>
                            {txn.type === "credit" ? (
                              <ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ArrowLeft className="h-4 w-4 rotate-180 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{txn.description}</p>
                            <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{formatDate(txn.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={cn(
                              "text-sm font-semibold",
                              txn.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            )}>
                              {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                            </p>
                          </div>
                          <Badge variant={statusBadge[txn.status]?.variant ?? "default"}>
                            {txn.status}
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyReceiptId(txn.id)}
                                >
                                  {copiedReceipt === txn.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{copiedReceipt === txn.id ? "Copied!" : "Copy Transaction ID"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-6">
              <AnimatedCard delay={0.15}>
                <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                  <CardHeader>
                    <CardTitle className={cn("text-lg", isDark ? "text-white" : "")}>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Service Info */}
                    <div className="flex gap-3">
                      <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl", isDark ? "bg-slate-700" : "bg-primary-50")}>
                        <FileText className="h-6 w-6 text-primary-500" />
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{serviceName}</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>with {technicianName}</p>
                      </div>
                    </div>

                    <Separator className={cn(isDark ? "bg-slate-700" : "")} />

                    {/* Date & Time */}
                    <div className="flex items-center gap-2">
                      <Calendar className={cn("h-4 w-4", isDark ? "text-slate-400" : "text-slate-500")} />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                        {formatDate(scheduledDate)} at {timeSlot}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin className={cn("mt-0.5 h-4 w-4 shrink-0", isDark ? "text-slate-400" : "text-slate-500")} />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>{address}</span>
                    </div>

                    <Separator className={cn(isDark ? "bg-slate-700" : "")} />

                    {/* Price Breakdown */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Subtotal</span>
                        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Platform Fee (5%)</span>
                        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(platformFee)}</span>
                      </div>
                      {couponApplied && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex justify-between"
                        >
                          <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                            <Tag className="h-3.5 w-3.5" />
                            Discount (15%)
                          </span>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            -{formatCurrency(discountAmount)}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <Separator className={cn(isDark ? "bg-slate-700" : "")} />

                    {/* Coupon Code */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                        className={cn(isDark ? "border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500" : "")}
                      />
                      <Button
                        variant={couponApplied ? "default" : "outline"}
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !couponCode}
                        className={cn(couponApplied && "bg-emerald-500 hover:bg-emerald-600", !couponApplied && isDark && "border-slate-600 text-slate-300")}
                      >
                        {couponApplied ? (
                          <><Check className="h-4 w-4" /> Applied</>
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Coupon {couponCode.toUpperCase()} applied! You save {formatCurrency(discountAmount)}.
                      </p>
                    )}

                    <Separator className={cn(isDark ? "bg-slate-700" : "")} />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className={cn("text-base font-semibold", isDark ? "text-white" : "text-slate-900")}>Total</span>
                      <span className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(total)}</span>
                    </div>

                    {/* Security Badge */}
                    <div className={cn(
                      "flex items-center justify-center gap-2 rounded-xl py-3",
                      isDark ? "bg-slate-700/30" : "bg-slate-50"
                    )}>
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        Secure 256-bit SSL Encryption
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.25}>
                <Link to="/bookings">
                  <Button variant="outline" className={cn("w-full gap-2", isDark && "border-slate-600 text-slate-300")}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bookings
                  </Button>
                </Link>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
