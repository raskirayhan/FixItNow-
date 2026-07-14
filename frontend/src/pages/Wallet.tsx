import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Ticket,
  Percent,
  Star,
  Copy,
  Check,
  Loader2,
  CreditCard,
  Building2,
  Smartphone,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Banknote,
  PiggyBank,
  Award,
  Sparkles,
  Tag,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { useWallet, useAddMoney } from "@/hooks/useApi";
import { toast } from "@/components/ui/toast";
import { walletData as mockWalletData } from "@/mock/data";
import type { Transaction, Coupon, Reward } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedCard from "@/components/shared/AnimatedCard";
import PageHeader from "@/components/shared/PageHeader";

const topUpAmounts = [10, 25, 50, 100, 200];

const transactionIcon: Record<string, { bg: string; icon: typeof ArrowDownLeft; color: string }> = {
  credit: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: ArrowDownLeft,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  debit: {
    bg: "bg-red-100 dark:bg-red-900/30",
    icon: ArrowUpRight,
    color: "text-red-600 dark:text-red-400",
  },
};

const statusConfig: Record<string, { variant: "success" | "warning" | "destructive"; label: string }> = {
  COMPLETED: { variant: "success", label: "Completed" },
  PENDING: { variant: "warning", label: "Pending" },
  FAILED: { variant: "destructive", label: "Failed" },
};

export default function Wallet() {
  const { isDark } = useThemeContext();
  const queryClient = useQueryClient();
  const walletQuery = useWallet();
  const addMoneyMutation = useAddMoney();
  const walletData: { balance: number; pendingAmount: number; totalEarned: number; totalSpent: number; transactions: Transaction[]; coupons: Coupon[]; rewards: Reward[] } = useMemo(() => {
    const api = walletQuery.data?.data;
    return {
      balance: api?.balance ?? 0,
      pendingAmount: api?.pendingAmount ?? 0,
      totalEarned: api?.totalEarned ?? 0,
      totalSpent: api?.totalSpent ?? 0,
      transactions: api?.transactions ?? [],
      coupons: api?.coupons ?? mockWalletData.coupons,
      rewards: api?.rewards ?? mockWalletData.rewards,
    };
  }, [walletQuery.data]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null);
  const [addPaymentMethod, setAddPaymentMethod] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [visibleTxns, setVisibleTxns] = useState(5);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const allTransactions = walletData.transactions;
  const displayedTransactions = useMemo(() => allTransactions.slice(0, visibleTxns), [allTransactions, visibleTxns]);
  const hasMore = visibleTxns < allTransactions.length;

  const totalPoints = walletData.rewards.reduce((sum: number, r: Reward) => sum + (r.claimed ? r.points : 0), 0);
  const nextRewardPoints = 500;
  const pointsProgress = Math.min((totalPoints / nextRewardPoints) * 100, 100);

  const activeCoupons = walletData.coupons.filter((c: Coupon) => !c.used && new Date(c.expiresAt) > new Date());
  const expiredCoupons = walletData.coupons.filter((c: Coupon) => c.used || new Date(c.expiresAt) <= new Date());

  const handleAddMoney = async () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return;
    try {
      await addMoneyMutation.mutateAsync({ amount });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setShowAddMoney(false);
      setAddAmount("");
      setSelectedTopUp(null);
      setAddPaymentMethod("");
      toast({ title: "Money Added", description: `${formatCurrency(amount)} has been added to your wallet.`, variant: "success" });
    } catch (error: any) {
      toast({ title: "Failed to Add Money", description: error?.response?.data?.message || "Something went wrong.", variant: "error" });
    }
  };

  const handleWithdraw = () => {
    setWithdrawLoading(true);
    setTimeout(() => {
      setWithdrawLoading(false);
      setShowWithdraw(false);
      setWithdrawAmount("");
      setWithdrawBank("");
      setWithdrawAccount("");
    }, 2000);
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTopUpSelect = (amount: number) => {
    setSelectedTopUp(amount);
    setAddAmount(amount.toString());
  };

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="My Wallet"
          subtitle="Manage your balance, transactions, and rewards"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Wallet", href: "/wallet" },
          ]}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left Column: Balance Card + Transactions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Wallet Balance Card */}
            <AnimatedCard delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-xl sm:p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-100">Available Balance</p>
                      <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                        {formatCurrency(walletData.balance)}
                      </p>
                      {walletData.pendingAmount > 0 && (
                        <p className="mt-2 text-sm text-emerald-100">
                          {formatCurrency(walletData.pendingAmount)} pending
                        </p>
                      )}
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <WalletIcon className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-200" />
                        <span className="text-xs text-emerald-200">Earned</span>
                      </div>
                      <p className="mt-1 text-lg font-bold">{formatCurrency(walletData.totalEarned)}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5">
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-200" />
                        <span className="text-xs text-emerald-200">Spent</span>
                      </div>
                      <p className="mt-1 text-lg font-bold">{formatCurrency(walletData.totalSpent)}</p>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button
                        className="flex-1 gap-2 bg-white text-emerald-600 hover:bg-emerald-50"
                        size="lg"
                        onClick={() => setShowAddMoney(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Money
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
                        size="lg"
                        onClick={() => setShowWithdraw(true)}
                      >
                        <Banknote className="h-4 w-4" />
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Tabs */}
            <AnimatedCard delay={0.2}>
              <Tabs defaultValue="transactions" className="w-full">
                <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                  <CardHeader className="pb-0">
                    <TabsList className={cn("w-full justify-start", isDark && "bg-slate-700")}>
                      <TabsTrigger value="transactions" className="gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger value="rewards" className="gap-1.5">
                        <Gift className="h-3.5 w-3.5" />
                        Rewards
                      </TabsTrigger>
                      <TabsTrigger value="cashback" className="gap-1.5">
                        <Percent className="h-3.5 w-3.5" />
                        Cashback
                      </TabsTrigger>
                      <TabsTrigger value="coupons" className="gap-1.5">
                        <Ticket className="h-3.5 w-3.5" />
                        Coupons
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {/* Recent Transactions */}
                    <TabsContent value="transactions" className="mt-0">
                      <div className="space-y-3">
                        {displayedTransactions.map((txn: Transaction, idx: number) => {
                          const config = transactionIcon[txn.type];
                          const IconComp = config.icon;
                          const status = statusConfig[txn.status] ?? statusConfig.COMPLETED;

                          return (
                            <motion.div
                              key={txn.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.03 * idx }}
                              className={cn(
                                "flex items-center justify-between rounded-xl border p-3 transition-colors sm:p-4",
                                isDark
                                  ? "border-slate-700/50 hover:bg-slate-700/30"
                                  : "border-slate-100 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", config.bg)}>
                                  <IconComp className={cn("h-5 w-5", config.color)} />
                                </div>
                                <div>
                                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                    {txn.description}
                                  </p>
                                  <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                    {formatRelativeTime(txn.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className={cn(
                                    "text-sm font-bold",
                                    txn.type === "credit"
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  )}>
                                    {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                                  </p>
                                </div>
                                <Badge variant={status.variant} className="hidden sm:inline-flex">
                                  {status.label}
                                </Badge>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      {hasMore && (
                        <div className="mt-4 text-center">
                          <Button
                            variant="outline"
                            onClick={() => setVisibleTxns((prev) => prev + 5)}
                            className={cn(isDark && "border-slate-600 text-slate-300")}
                          >
                            Load More
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    {/* Rewards */}
                    <TabsContent value="rewards" className="mt-0 space-y-6">
                      {/* Points Card */}
                      <div className={cn(
                        "rounded-xl border p-4",
                        isDark ? "border-amber-900/30 bg-amber-900/10" : "border-amber-200 bg-amber-50"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                              <Star className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Reward Points</p>
                              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{totalPoints}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Next reward at</p>
                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{nextRewardPoints} pts</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Progress
                            value={pointsProgress}
                            className="h-2"
                            indicatorClassName="bg-amber-500"
                          />
                          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                            {nextRewardPoints - totalPoints} points to next reward
                          </p>
                        </div>
                      </div>

                      {/* Rewards List */}
                      <div className="space-y-3">
                        {walletData.rewards.map((reward: Reward, idx: number) => (
                          <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            className={cn(
                              "flex items-center justify-between rounded-xl border p-4",
                              reward.claimed
                                ? isDark
                                  ? "border-slate-700/30 bg-slate-800/40 opacity-60"
                                  : "border-slate-100 bg-slate-50 opacity-60"
                                : isDark
                                  ? "border-slate-700/50 hover:border-slate-600"
                                  : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-xl",
                                reward.claimed
                                  ? "bg-slate-100 dark:bg-slate-700"
                                  : "bg-primary-100 dark:bg-primary-900/30"
                              )}>
                                <Award className={cn("h-5 w-5", reward.claimed ? "text-slate-400" : "text-primary-500")} />
                              </div>
                              <div>
                                <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                  {reward.title}
                                </p>
                                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                  {reward.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                                  {reward.points} pts
                                </p>
                              </div>
                              {reward.claimed ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Claimed
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={totalPoints < reward.points}
                                  className="gap-1"
                                >
                                  Claim
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Cashback */}
                    <TabsContent value="cashback" className="mt-0 space-y-6">
                      {/* Active Cashback Offers */}
                      <div>
                        <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                          Active Offers
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            { title: "First Wallet Top-up", percentage: 10, maxBonus: 50, description: "Get 10% cashback on your first wallet top-up" },
                            { title: "Referral Bonus", percentage: 5, maxBonus: 25, description: "Earn 5% cashback when you refer a friend" },
                            { title: "Weekend Special", percentage: 8, maxBonus: 40, description: "8% cashback on all weekend bookings" },
                            { title: "Loyalty Cashback", percentage: 3, maxBonus: 100, description: "3% cashback on every booking after 10th" },
                          ].map((offer, idx) => (
                            <motion.div
                              key={offer.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * idx }}
                              className={cn(
                                "rounded-xl border p-4 transition-colors",
                                isDark
                                  ? "border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-800/50 hover:border-primary-800"
                                  : "border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-primary-300"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{offer.title}</p>
                                  <p className={cn("mt-0.5 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{offer.description}</p>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{offer.percentage}%</span>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                  Max bonus: {formatCurrency(offer.maxBonus)}
                                </span>
                                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                                  Learn more <ArrowRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Cashback History */}
                      <div>
                        <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                          Earned Cashback
                        </h3>
                        <div className="space-y-2">
                          {[
                            { date: "2026-07-10", amount: 9, description: "Cashback on Interior Painting" },
                            { date: "2026-07-01", amount: 2.5, description: "Welcome Bonus Cashback" },
                            { date: "2026-06-25", amount: 19, description: "Cashback on Deck Repair" },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "flex items-center justify-between rounded-lg border p-3",
                                isDark ? "border-slate-700/50" : "border-slate-100"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                  <Percent className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{item.description}</p>
                                  <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{formatDate(item.date)}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                +{formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Coupons */}
                    <TabsContent value="coupons" className="mt-0 space-y-6">
                      {/* Available Coupons */}
                      <div>
                        <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                          Available Coupons
                        </h3>
                        <div className="space-y-3">
                           {activeCoupons.map((coupon: Coupon, idx: number) => (
                            <motion.div
                              key={coupon.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * idx }}
                              className={cn(
                                "relative overflow-hidden rounded-xl border p-4",
                                isDark
                                  ? "border-primary-800/50 bg-gradient-to-r from-primary-900/20 to-transparent"
                                  : "border-primary-200 bg-gradient-to-r from-primary-50 to-transparent"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40">
                                    <Tag className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                                        {coupon.type === "percentage" ? `${coupon.discount}% OFF` : `${formatCurrency(coupon.discount)} OFF`}
                                      </span>
                                    </div>
                                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                      Min. order {formatCurrency(coupon.minOrder ?? 0)} · Expires {formatDate(coupon.expiresAt)}
                                    </p>
                                  </div>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => copyCouponCode(coupon.code)}
                                      >
                                        {copiedCode === coupon.code ? (
                                          <><Check className="h-3.5 w-3.5" /> Copied</>
                                        ) : (
                                          <><Copy className="h-3.5 w-3.5" /> {coupon.code}</>
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{copiedCode === coupon.code ? "Copied to clipboard!" : "Click to copy code"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              {/* Decorative perforation */}
                              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center">
                                <div className="-ml-px h-2 w-2 rounded-full bg-white dark:bg-slate-950" />
                                <div className="h-2 w-2 rounded-full bg-white dark:bg-slate-950" />
                                <div className="h-2 w-2 rounded-full bg-white dark:bg-slate-950" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Expired / Used Coupons */}
                      {expiredCoupons.length > 0 && (
                        <div>
                          <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-3", isDark ? "text-slate-500" : "text-slate-400")}>
                            Expired / Used
                          </h3>
                          <div className="space-y-3">
                             {expiredCoupons.map((coupon: Coupon, idx: number) => (
                              <div
                                key={coupon.id}
                                className={cn(
                                  "flex items-center justify-between rounded-xl border p-4 opacity-50 grayscale",
                                  isDark ? "border-slate-700/30" : "border-slate-100"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", isDark ? "bg-slate-700" : "bg-slate-100")}>
                                    <Tag className={cn("h-6 w-6", isDark ? "text-slate-500" : "text-slate-400")} />
                                  </div>
                                  <div>
                                    <span className={cn("text-lg font-bold", isDark ? "text-slate-400" : "text-slate-600")}>
                                      {coupon.type === "percentage" ? `${coupon.discount}% OFF` : `${formatCurrency(coupon.discount)} OFF`}
                                    </span>
                                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                      {coupon.used ? "Used" : "Expired"} · Code: {coupon.code}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="opacity-60">
                                  {coupon.used ? "Used" : "Expired"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </CardContent>
                </Card>
              </Tabs>
            </AnimatedCard>
          </div>

          {/* Right Column: Quick Top-up + Summary */}
          <div className="space-y-6">
            {/* Quick Top-up */}
            <AnimatedCard delay={0.15}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Sparkles className="h-5 w-5 text-primary-500" />
                    Quick Top-up
                  </CardTitle>
                  <CardDescription className={cn(isDark ? "text-slate-400" : "")}>
                    Add funds to your wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {topUpAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleTopUpSelect(amount)}
                        className={cn(
                          "rounded-xl border-2 p-3 text-center transition-all duration-200",
                          selectedTopUp === amount
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : isDark
                              ? "border-slate-700 hover:border-slate-600 hover:bg-slate-700/30"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <span className={cn(
                          "text-lg font-bold",
                          selectedTopUp === amount
                            ? "text-primary-600 dark:text-primary-400"
                            : isDark ? "text-white" : "text-slate-900"
                        )}>
                          ${amount}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => { setSelectedTopUp(null); setAddAmount(""); setShowAddMoney(true); }}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 transition-all duration-200",
                        isDark
                          ? "border-slate-600 hover:border-primary-700 hover:bg-slate-700/30"
                          : "border-slate-300 hover:border-primary-400 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Custom</span>
                    </button>
                  </div>
                  <Button
                    className="w-full gap-2"
                    onClick={() => setShowAddMoney(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Money
                  </Button>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Wallet Summary */}
            <AnimatedCard delay={0.2}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "")}>Wallet Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Current Balance</span>
                    <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(walletData.balance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Pending</span>
                    <span className={cn("text-sm font-semibold text-amber-600 dark:text-amber-400")}>{formatCurrency(walletData.pendingAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total Earned</span>
                    <span className={cn("text-sm font-semibold text-emerald-600 dark:text-emerald-400")}>{formatCurrency(walletData.totalEarned)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total Spent</span>
                    <span className={cn("text-sm font-semibold text-red-600 dark:text-red-400")}>{formatCurrency(walletData.totalSpent)}</span>
                  </div>
                  <Separator className={cn(isDark ? "bg-slate-700" : "")} />
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Transactions</span>
                    <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{allTransactions.length}</span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Rewards Progress */}
            <AnimatedCard delay={0.25}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Award className="h-5 w-5 text-amber-500" />
                    Rewards Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Points Earned</span>
                    <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>{totalPoints}</span>
                  </div>
                  <Progress value={pointsProgress} className="h-2" indicatorClassName="bg-amber-500" />
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                      {walletData.rewards.filter((r: Reward) => r.claimed).length} of {walletData.rewards.length} claimed
                    </span>
                    <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                      {nextRewardPoints - totalPoints} to next reward
                    </span>
                  </div>
                  <Button variant="outline" className={cn("w-full gap-2", isDark && "border-slate-600 text-slate-300")} asChild>
                    <Link to="/rewards">
                      View All Rewards
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
        <DialogContent className={cn("sm:max-w-md", isDark && "border-slate-700 bg-slate-800")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>Add Money to Wallet</DialogTitle>
            <DialogDescription className={cn(isDark && "text-slate-400")}>
              Enter the amount and choose a payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-2">
              {topUpAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setAddAmount(amount.toString()); setSelectedTopUp(amount); }}
                  className={cn(
                    "rounded-xl border-2 p-2.5 text-center text-sm font-bold transition-all",
                    selectedTopUp === amount
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : isDark
                        ? "border-slate-600 text-slate-300 hover:border-slate-500"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Or enter custom amount
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => { setAddAmount(e.target.value); setSelectedTopUp(null); }}
                min="1"
                className={cn(isDark && "border-slate-600 bg-slate-700/50 text-white")}
              />
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Payment Method
              </label>
              <Select value={addPaymentMethod} onValueChange={setAddPaymentMethod}>
                <SelectTrigger className={cn(isDark && "border-slate-600 bg-slate-700/50 text-white")}>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit / Debit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Banking
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMoney(false)}>Cancel</Button>
            <Button
              onClick={handleAddMoney}
              disabled={!addAmount || Number(addAmount) <= 0 || !addPaymentMethod || addMoneyMutation.isPending}
              className="gap-2"
            >
              {addMoneyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {addMoneyMutation.isPending ? "Processing..." : "Add Money"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className={cn("sm:max-w-md", isDark && "border-slate-700 bg-slate-800")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>Withdraw Funds</DialogTitle>
            <DialogDescription className={cn(isDark && "text-slate-400")}>
              Transfer money from your wallet to your bank account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className={cn(
              "rounded-xl border p-3",
              isDark ? "border-slate-600 bg-slate-700/30" : "border-slate-200 bg-slate-50"
            )}>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Available Balance</p>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(walletData.balance)}</p>
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Withdrawal Amount
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={walletData.balance}
                min="1"
                className={cn(isDark && "border-slate-600 bg-slate-700/50 text-white")}
              />
              <button
                onClick={() => setWithdrawAmount(walletData.balance.toString())}
                className="mt-1.5 text-xs font-medium text-primary-600 hover:underline"
              >
                Max: {formatCurrency(walletData.balance)}
              </button>
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Bank Name
              </label>
              <Select value={withdrawBank} onValueChange={setWithdrawBank}>
                <SelectTrigger className={cn(isDark && "border-slate-600 bg-slate-700/50 text-white")}>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {["Chase Bank", "Bank of America", "Wells Fargo", "Citibank", "Capital One"].map((bank) => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                Account Number
              </label>
              <Input
                placeholder="Enter account number"
                value={withdrawAccount}
                onChange={(e) => setWithdrawAccount(e.target.value)}
                className={cn(isDark && "border-slate-600 bg-slate-700/50 text-white")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdraw(false)}>Cancel</Button>
            <Button
              onClick={handleWithdraw}
              disabled={
                !withdrawAmount ||
                Number(withdrawAmount) <= 0 ||
                Number(withdrawAmount) > walletData.balance ||
                !withdrawBank ||
                !withdrawAccount ||
                withdrawLoading
              }
              className="gap-2"
            >
              {withdrawLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
              {withdrawLoading ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
