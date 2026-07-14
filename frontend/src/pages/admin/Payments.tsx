import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  DollarSign,
  Clock,
  CheckCircle2,
  RotateCcw,
  CreditCard,
  Wallet,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import AnimatedCard from "@/components/shared/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAdminBookings } from "@/hooks/useApi";
import type { PaymentStatus } from "@/types";

const ITEMS_PER_PAGE = 10;

const STATUS_BADGE_COLORS: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminPayments() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: bookingsResp, isLoading } = useAdminBookings();
  const allBookings = bookingsResp?.data ?? [];

  const PAYMENT_DATA = useMemo(() => {
    return allBookings.map((b: any) => ({
      id: b.id,
      transactionId: b.payment?.transactionId || `TXN-${b.id}`,
      customer: b.customer?.name || "Unknown",
      customerAvatar: b.customer?.avatar || "",
      amount: b.totalAmount || 0,
      method: b.payment?.provider || "Stripe",
      status: b.payment?.status || (b.status === "COMPLETED" ? "COMPLETED" : b.status === "PAID" ? "PENDING" : "PENDING") as PaymentStatus,
      date: b.createdAt,
    }));
  }, [allBookings]);

  const totalRevenue = PAYMENT_DATA.filter((p: any) => p.status === "COMPLETED").reduce((s: number, p: any) => s + p.amount, 0);
  const pendingAmount = PAYMENT_DATA.filter((p: any) => p.status === "PENDING").reduce((s: number, p: any) => s + p.amount, 0);
  const completedAmount = totalRevenue;
  const refundedAmount = PAYMENT_DATA.filter((p: any) => p.status === "FAILED").reduce((s: number, p: any) => s + p.amount, 0);

  const filteredPayments = useMemo(() => {
    return PAYMENT_DATA.filter((p: any) => {
      const matchesSearch =
        p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [PAYMENT_DATA, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-16 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Payments
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Monitor all transactions and payment activity
          </p>
        </div>
        <Button variant="outline" className={cn(isDark && "border-slate-700 text-slate-300")}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={totalRevenue} prefix="$" trend={18.2} />
        <StatCard icon={Clock} label="Pending" value={pendingAmount} prefix="$" trend={-5.3} />
        <StatCard icon={CheckCircle2} label="Completed" value={completedAmount} prefix="$" trend={12.1} />
        <StatCard icon={RotateCcw} label="Refunded" value={refundedAmount} prefix="$" trend={-2.8} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by transaction ID or customer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "pl-10",
              isDark && "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            )}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className={cn("w-full sm:w-44", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card
        className={cn(
          "border",
          isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
        )}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={cn("border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Transaction ID</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Customer</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Amount</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Method</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {paginatedPayments.map((payment: any, idx: number) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        "border-b transition-colors last:border-0",
                        isDark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      <td className={cn("px-6 py-4 font-mono text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={payment.customerAvatar}
                            alt=""
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {payment.customer}
                          </span>
                        </div>
                      </td>
                      <td className={cn("px-6 py-4 font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {payment.method === "Credit Card" && <CreditCard className="h-3.5 w-3.5 text-blue-500" />}
                          {payment.method === "Bank Transfer" && <Banknote className="h-3.5 w-3.5 text-emerald-500" />}
                          {payment.method === "Stripe" && <DollarSign className="h-3.5 w-3.5 text-purple-500" />}
                          {payment.method === "Wallet" && <Wallet className="h-3.5 w-3.5 text-amber-500" />}
                          <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                            {payment.method}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("border text-[10px]", STATUS_BADGE_COLORS[payment.status] || "")}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-slate-400" : "text-slate-500")}>
                        {formatDate(payment.date)}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className={cn(
              "flex items-center justify-between border-t px-6 py-4",
              isDark ? "border-slate-700" : "border-slate-200"
            )}
          >
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredPayments.length)} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)} of{" "}
              {filteredPayments.length} payments
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(isDark && "border-slate-700 text-slate-300")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    page === currentPage && "bg-primary-600 text-white hover:bg-primary-700",
                    isDark && page !== currentPage && "border-slate-700 text-slate-300"
                  )}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className={cn(isDark && "border-slate-700 text-slate-300")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
