import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Wallet,
  Clock,
  Star,
  Bell,
  Wrench,
  Search,
  TrendingUp,
  ChevronRight,
  Eye,
  Sparkles,
  Plus,
  Activity,
  MapPin,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import { useCustomerBookings, useWallet, useNotifications } from "@/hooks/useApi";
import type { BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";

const statusVariant: Record<BookingStatus, "success" | "warning" | "destructive" | "info" | "default"> = {
  REQUESTED: "warning",
  ACCEPTED: "info",
  DECLINED: "destructive",
  PAID: "default",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

const statusLabel: Record<BookingStatus, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  PAID: "Paid",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function CustomerDashboard() {
  const { isDark } = useThemeContext();
  const userName = "Sarah Johnson";
  const userAvatar = "https://i.pravatar.cc/150?img=1";

  const { data: bookingsResp, isLoading: bookingsLoading } = useCustomerBookings();
  const { data: walletResp, isLoading: walletLoading } = useWallet();
  const { data: notificationsResp, isLoading: notifsLoading } = useNotifications();

  const bookingsData: any[] = bookingsResp?.data ?? [];
  const walletData = walletResp?.data;
  const notificationsData = notificationsResp?.data ?? [];

  const customerBookings = useMemo(() => bookingsData, [bookingsData]);

  const upcomingBookings = useMemo(
    () =>
      customerBookings
        .filter((b: any) => ["REQUESTED", "ACCEPTED", "PAID"].includes(b.status))
        .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 3),
    [customerBookings]
  );

  const completedCount = useMemo(
    () => customerBookings.filter((b: any) => b.status === "COMPLETED").length,
    [customerBookings]
  );

  const totalSpent = useMemo(
    () => customerBookings.filter((b: any) => b.status === "COMPLETED").reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
    [customerBookings]
  );

  const recentBookings = useMemo(
    () =>
      customerBookings
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [customerBookings]
  );

  const favoriteTechs = useMemo(() => {
    const techMap = new Map();
    customerBookings.forEach((b: any) => {
      if (b.technician && !techMap.has(b.technicianId)) {
        techMap.set(b.technicianId, b.technician);
      }
    });
    return Array.from(techMap.values()).slice(0, 3);
  }, [customerBookings]);

  const userNotifications = useMemo(() => notificationsData.slice(0, 3), [notificationsData]);

  const monthlySpending = [
    { month: "Feb", amount: 120 },
    { month: "Mar", amount: 250 },
    { month: "Apr", amount: 180 },
    { month: "May", amount: 380 },
    { month: "Jun", amount: 425 },
    { month: "Jul", amount: totalSpent || 150 },
  ];

  const maxSpending = Math.max(...monthlySpending.map((m) => m.amount));

  const serviceBreakdown = [
    { name: "Plumbing", amount: 150, color: "bg-blue-500" },
    { name: "Electrical", amount: 500, color: "bg-yellow-500" },
    { name: "Cleaning", amount: 200, color: "bg-emerald-500" },
    { name: "Painting", amount: 180, color: "bg-purple-500" },
    { name: "Landscaping", amount: 45, color: "bg-teal-500" },
  ];

  const totalServices = serviceBreakdown.reduce((sum, s) => sum + s.amount, 0);

  const notifIconMap: Record<string, typeof Bell> = {
    success: CheckCircle2,
    warning: Clock,
    error: Bell,
    info: Bell,
  };

  const notifColorMap: Record<string, string> = {
    success: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    warning: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    error: "text-red-500 bg-red-100 dark:bg-red-900/30",
    info: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  };

  const walletBalance = walletData?.balance ?? 0;
  const walletPending = walletData?.pendingAmount ?? 0;
  const walletLastTxn = walletData?.transactions?.[0]?.description;

  if (bookingsLoading) {
    return (
      <DashboardLayout role="CUSTOMER">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-24 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="CUSTOMER">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-primary-100 dark:ring-primary-900/40">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                {getGreeting()}, {userName.split(" ")[0]}!
              </h1>
              <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                {formatDate(new Date())} &middot; Here&apos;s what&apos;s happening with your home services
              </p>
            </div>
          </div>
          <Link to="/services">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Book a Service
            </Button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Calendar} label="Upcoming Bookings" value={upcomingBookings.length} trend={12} />
          <StatCard icon={CheckCircle2} label="Completed Services" value={completedCount} trend={8} />
          <StatCard icon={DollarSign} label="Total Spent" value={totalSpent} prefix="$" trend={-3} />
          <StatCard icon={Wallet} label="Wallet Balance" value={walletBalance} prefix="$" decimals={2} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upcoming Bookings */}
            <motion.div variants={item}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Calendar className="h-5 w-5 text-primary-500" />
                    Upcoming Bookings
                  </CardTitle>
                  <Link
                    to="/bookings"
                    className={cn("flex items-center gap-1 text-sm font-medium hover:text-primary-600", isDark ? "text-slate-400" : "text-slate-500")}
                  >
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length === 0 ? (
                    <div className={cn("py-8 text-center", isDark ? "text-slate-400" : "text-slate-500")}>
                      <Calendar className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p className="text-sm">No upcoming bookings</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingBookings.map((booking: any, idx: number) => {
                        const tech = booking.technician;
                        const svc = booking.service;
                        const bookingStatus = booking.status as BookingStatus;
                        return (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            className={cn(
                              "flex items-center justify-between rounded-xl border p-3 transition-colors sm:p-4",
                              isDark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={tech?.user?.avatar} alt={tech?.user?.name} />
                                <AvatarFallback>{tech?.user?.name ? getInitials(tech.user.name) : "?"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                  {svc?.title ?? "Service"}
                                </p>
                                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                  {tech?.user?.name ?? "Technician"} &middot; {formatDate(booking.scheduledAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={statusVariant[bookingStatus]} className="hidden sm:inline-flex">
                                {statusLabel[bookingStatus]}
                              </Badge>
                              <Link to={`/bookings/${booking.id}`}>
                                <Button variant="ghost" size="sm" className="gap-1 h-8">
                                  <Eye className="h-3.5 w-3.5" /> View
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={item}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Activity className="h-5 w-5 text-primary-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {recentBookings.map((booking: any, idx: number) => {
                      const tech = booking.technician;
                      const svc = booking.service;
                      const bookingStatus2 = booking.status as BookingStatus;
                      const isLast = idx === recentBookings.length - 1;
                      return (
                        <div key={booking.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                booking.status === "COMPLETED"
                                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                                  : booking.status === "CANCELLED" || booking.status === "DECLINED"
                                    ? "bg-red-100 dark:bg-red-900/30"
                                    : "bg-primary-100 dark:bg-primary-900/30"
                              )}
                            >
                              {booking.status === "COMPLETED" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : booking.status === "CANCELLED" || booking.status === "DECLINED" ? (
                                <CheckCircle2 className="h-4 w-4 text-red-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                              )}
                            </div>
                            {!isLast && <div className={cn("w-0.5 flex-1", isDark ? "bg-slate-700" : "bg-slate-200")} />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                  {svc?.title ?? "Service"}
                                </p>
                                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                  with {tech?.user?.name ?? "Technician"} &middot; {formatCurrency(booking.totalAmount)}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant={statusVariant[bookingStatus2]} className="text-[10px]">
                                  {statusLabel[bookingStatus2]}
                                </Badge>
                                <p className={cn("mt-1 text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>
                                  {formatRelativeTime(booking.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <motion.div variants={item}>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                  <CardHeader className="pb-2">
                    <CardTitle className={cn("flex items-center gap-2 text-base", isDark ? "text-white" : "")}>
                      <TrendingUp className="h-4 w-4 text-primary-500" />
                      Monthly Spending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 h-40">
                      {monthlySpending.map((m, idx) => {
                        const height = maxSpending > 0 ? (m.amount / maxSpending) * 100 : 0;
                        const isCurrentMonth = idx === monthlySpending.length - 1;
                        return (
                          <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: 0.1 + idx * 0.08, duration: 0.5, ease: "easeOut" }}
                              className={cn(
                                "w-full rounded-t-lg transition-colors",
                                isCurrentMonth
                                  ? "bg-primary-500"
                                  : isDark
                                    ? "bg-slate-600 hover:bg-slate-500"
                                    : "bg-slate-200 hover:bg-slate-300"
                              )}
                            />
                            <span className={cn("text-[10px] font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                              {m.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                  <CardHeader className="pb-2">
                    <CardTitle className={cn("flex items-center gap-2 text-base", isDark ? "text-white" : "")}>
                      <Sparkles className="h-4 w-4 text-primary-500" />
                      Services Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {serviceBreakdown.map((svc) => {
                      const pct = totalServices > 0 ? Math.round((svc.amount / totalServices) * 100) : 0;
                      return (
                        <div key={svc.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn("text-xs font-medium", isDark ? "text-slate-300" : "text-slate-600")}>{svc.name}</span>
                            <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{pct}%</span>
                          </div>
                          <div className={cn("h-2 w-full rounded-full", isDark ? "bg-slate-700" : "bg-slate-100")}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                              className={cn("h-full rounded-full", svc.color)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div variants={item}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader className="pb-3">
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "")}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/services">
                    <Button variant="outline" className={cn("w-full justify-start gap-3", isDark && "border-slate-600 text-slate-300")}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                        <Wrench className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">Book a Service</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Browse available services</p>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/wallet">
                    <Button variant="outline" className={cn("w-full justify-start gap-3", isDark && "border-slate-600 text-slate-300")}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">View Wallet</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Balance: {formatCurrency(walletBalance)}</p>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/technicians">
                    <Button variant="outline" className={cn("w-full justify-start gap-3", isDark && "border-slate-600 text-slate-300")}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Search className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">Find Technicians</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Search top-rated pros</p>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Favorite Technicians */}
            <motion.div variants={item}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Star className="h-5 w-5 text-amber-500" />
                    Favorites
                  </CardTitle>
                  <Link
                    to="/technicians"
                    className={cn("text-xs font-medium hover:text-primary-600", isDark ? "text-slate-400" : "text-slate-500")}
                  >
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {favoriteTechs.map((tech: any, idx: number) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                        isDark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={tech.user?.avatar} alt={tech.user?.name} />
                        <AvatarFallback>{tech.user?.name ? getInitials(tech.user.name) : "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold truncate", isDark ? "text-white" : "text-slate-900")}>
                          {tech.user?.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className={cn("text-xs font-medium", isDark ? "text-white" : "text-slate-900")}>{tech.rating}</span>
                          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                            ({tech.totalReviews})
                          </span>
                        </div>
                      </div>
                      <Link to={`/services/${tech.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 gap-1">
                          Book
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={item}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Bell className="h-5 w-5 text-primary-500" />
                    Notifications
                  </CardTitle>
                  <Link
                    to="/notifications"
                    className={cn("text-xs font-medium hover:text-primary-600", isDark ? "text-slate-400" : "text-slate-500")}
                  >
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userNotifications.length === 0 ? (
                    <p className={cn("py-4 text-center text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      No notifications
                    </p>
                  ) : (
                    userNotifications.map((notif: any, idx: number) => {
                      const IconComp = notifIconMap[notif.type] || Bell;
                      return (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx }}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-3 transition-colors",
                            isDark ? "border-slate-700/50" : "border-slate-100",
                            !notif.read && (isDark ? "bg-slate-700/20" : "bg-primary-50/50")
                          )}
                        >
                          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", notifColorMap[notif.type])}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{notif.title}</p>
                            <p className={cn("mt-0.5 text-xs line-clamp-2", isDark ? "text-slate-400" : "text-slate-500")}>
                              {notif.message}
                            </p>
                            <p className={cn("mt-1 text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>
                              {formatRelativeTime(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Wallet Summary */}
            <motion.div variants={item}>
              <Card className={cn(isDark ? "border-slate-700/50 bg-slate-800/80" : "")}>
                <CardHeader className="pb-3">
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isDark ? "text-white" : "")}>
                    <Wallet className="h-5 w-5 text-emerald-500" />
                    Wallet Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className={cn("rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white")}>
                    <p className="text-sm text-emerald-100">Balance</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(walletBalance)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Last Transaction</span>
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {walletLastTxn ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Pending</span>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      {formatCurrency(walletPending)}
                    </span>
                  </div>
                  <Link to="/wallet">
                    <Button variant="outline" className={cn("w-full gap-2", isDark && "border-slate-600 text-slate-300")}>
                      <Plus className="h-4 w-4" />
                      Top Up
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
