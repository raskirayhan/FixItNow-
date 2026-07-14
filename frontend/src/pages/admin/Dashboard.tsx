import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Download,
  AlertTriangle,
  Eye,
  Settings,
  BarChart3,
  FolderPlus,
  ChevronRight,
  ArrowUpRight,
  Shield,
  UserCheck,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import AnimatedCard from "@/components/shared/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAdminStats, useAdminBookings } from "@/hooks/useApi";
import type { BookingStatus } from "@/types";

const BOOKING_STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  REQUESTED: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const SYSTEM_ALERTS = [
  { title: "High server load detected", message: "15% increase in bookings over the past hour.", type: "warning" as const, time: "2h ago" },
  { title: "New technician registration", message: "3 new technicians pending verification.", type: "info" as const, time: "4h ago" },
  { title: "Payment gateway alert", message: "SSLCommerz responding slowly.", type: "warning" as const, time: "6h ago" },
];

const TOP_SERVICES = [
  { name: "Emergency Pipe Repair", bookings: 245, revenue: 36750 },
  { name: "Deep Home Cleaning", bookings: 210, revenue: 42000 },
  { name: "Interior Room Painting", bookings: 180, revenue: 32400 },
  { name: "AC System Tune-up", bookings: 165, revenue: 19800 },
  { name: "Electrical Panel Upgrade", bookings: 140, revenue: 70000 },
];

const chartData = {
  monthlyRevenue: [
    { label: "Feb", value: 12400 },
    { label: "Mar", value: 18200 },
    { label: "Apr", value: 15800 },
    { label: "May", value: 22500 },
    { label: "Jun", value: 19300 },
    { label: "Jul", value: 25800 },
  ],
  userGrowth: [
    { label: "Feb", value: 1200 },
    { label: "Mar", value: 1450 },
    { label: "Apr", value: 1680 },
    { label: "May", value: 1920 },
    { label: "Jun", value: 2150 },
    { label: "Jul", value: 2430 },
  ],
};

const maxRevenue = Math.max(...chartData.monthlyRevenue.slice(-6).map((d) => d.value));
const maxUserGrowth = Math.max(...chartData.userGrowth.map((d) => d.value));

export default function AdminDashboard() {
  const { isDark } = useThemeContext();

  const { data: statsResp } = useAdminStats();
  const { data: bookingsResp } = useAdminBookings();

  const stats = statsResp?.data ?? { totalUsers: 0, totalTechnicians: 0, totalBookings: 0, totalRevenue: 0, pendingBookings: 0, completedBookings: 0, activeServices: 0, monthlyGrowth: 0 };
  const allBookings = bookingsResp?.data ?? [];

  const recentBookings = useMemo(() => allBookings.slice(0, 5), [allBookings]);

  const recentRevenue = chartData.monthlyRevenue.slice(-6);

  const statusDistribution = useMemo(() => {
    const total = allBookings.length || 1;
    const counts: Record<string, number> = {};
    allBookings.forEach((b: any) => {
      const key = b.status === "COMPLETED" ? "Completed" : b.status === "IN_PROGRESS" ? "In Progress" : b.status === "REQUESTED" ? "Pending" : "Cancelled";
      counts[key] = (counts[key] || 0) + 1;
    });
    return [
      { label: "Completed", value: Math.round(((counts["Completed"] || 0) / total) * 100), color: "bg-emerald-500", count: counts["Completed"] || 0 },
      { label: "In Progress", value: Math.round(((counts["In Progress"] || 0) / total) * 100), color: "bg-blue-500", count: counts["In Progress"] || 0 },
      { label: "Pending", value: Math.round(((counts["Pending"] || 0) / total) * 100), color: "bg-amber-500", count: counts["Pending"] || 0 },
      { label: "Cancelled", value: Math.round(((counts["Cancelled"] || 0) / total) * 100), color: "bg-red-500", count: counts["Cancelled"] || 0 },
    ];
  }, [allBookings]);

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
            Admin Dashboard
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          trend={12.5}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats.totalRevenue}
          prefix="$"
          trend={18.2}
        />
        <StatCard
          icon={CalendarCheck}
          label="Active Bookings"
          value={stats.pendingBookings + 342}
          trend={8.3}
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Growth"
          value={stats.monthlyGrowth}
          suffix="%"
          decimals={1}
          trend={3.2}
        />
      </div>

      {/* Main Content - 2 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Revenue Chart */}
          <AnimatedCard delay={0}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  Revenue Overview
                </CardTitle>
                <Link
                  to="/admin/reports"
                  className={cn(
                    "text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  )}
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-end justify-between">
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Last 6 months</p>
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {formatCurrency(recentRevenue.reduce((s, d) => s + d.value, 0))}
                  </p>
                </div>
                <div className="flex items-end justify-between gap-3 h-52">
                  {recentRevenue.map((month, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.value / maxRevenue) * 100}%` }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.6 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary-700 via-primary-500 to-emerald-400 group cursor-pointer relative"
                      >
                        <div
                          className={cn(
                            "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                            isDark ? "bg-slate-700 text-white" : "bg-slate-900 text-white"
                          )}
                        >
                          {formatCurrency(month.value)}
                        </div>
                      </motion.div>
                      <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Booking Status Distribution */}
          <AnimatedCard delay={0.1}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  Booking Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statusDistribution.map((status) => (
                  <div key={status.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {status.label}
                        </span>
                        <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                          ({status.count.toLocaleString()})
                        </span>
                      </div>
                      <span className={cn("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
                        {status.value}%
                      </span>
                    </div>
                    <Progress value={status.value} className="h-2.5" indicatorClassName={status.color} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Recent Bookings Table */}
          <AnimatedCard delay={0.2}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  Recent Bookings
                </CardTitle>
                <Link
                  to="/admin/bookings"
                  className={cn("text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1")}
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={cn("border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                        <th className={cn("pb-3 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Customer</th>
                        <th className={cn("pb-3 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Technician</th>
                        <th className={cn("pb-3 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Service</th>
                        <th className={cn("pb-3 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Amount</th>
                        <th className={cn("pb-3 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                        <th className={cn("pb-3 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((bk: any) => (
                        <tr key={bk.id} className={cn("border-b last:border-0", isDark ? "border-slate-700/50" : "border-slate-100")}>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <img src={bk.customer?.avatar || ""} alt="" className="h-7 w-7 rounded-full object-cover" />
                              <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{bk.customer?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <img src={bk.technician?.user?.avatar || ""} alt="" className="h-7 w-7 rounded-full object-cover" />
                              <span className={cn(isDark ? "text-slate-300" : "text-slate-600")}>{bk.technician?.user?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className={cn("py-3", isDark ? "text-slate-300" : "text-slate-600")}>{bk.service?.title || "Unknown"}</td>
                          <td className={cn("py-3 font-semibold", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(bk.totalAmount)}</td>
                          <td className="py-3">
                            <Badge className={cn("border text-[10px]", BOOKING_STATUS_COLORS[bk.status] || "")}>
                              {bk.status}
                            </Badge>
                          </td>
                          <td className={cn("py-3", isDark ? "text-slate-400" : "text-slate-500")}>{formatDate(bk.scheduledAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* User Growth */}
          <AnimatedCard delay={0.1}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-1.5 h-36">
                  {chartData.userGrowth.slice(-6).map((month, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.value / maxUserGrowth) * 100}%` }}
                        transition={{ delay: 0.4 + idx * 0.05, duration: 0.5 }}
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                      />
                      <span className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Total Users</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Top Services */}
          <AnimatedCard delay={0.2}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  Top Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {TOP_SERVICES.map((service, idx) => (
                  <div
                    key={service.name}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-2 transition-colors",
                      isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        idx === 0
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : idx === 1
                            ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            : idx === 2
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                              : isDark
                                ? "bg-slate-700 text-slate-400"
                                : "bg-slate-100 text-slate-500"
                      )}
                    >
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-slate-900")}>
                        {service.name}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                        {service.bookings} bookings
                      </p>
                    </div>
                    <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      {formatCurrency(service.revenue)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* System Alerts */}
          <AnimatedCard delay={0.3}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-lg flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SYSTEM_ALERTS.map((alert, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-lg border p-3",
                      alert.type === "warning"
                        ? "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10"
                        : "border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-900/10"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        {alert.title}
                      </p>
                      <span className={cn("text-[10px] whitespace-nowrap", isDark ? "text-slate-500" : "text-slate-400")}>
                        {alert.time}
                      </span>
                    </div>
                    <p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {alert.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Quick Actions */}
          <AnimatedCard delay={0.4}>
            <Card
              className={cn(
                "border",
                isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Manage Users", icon: Users, href: "/admin/users", color: "text-blue-600 dark:text-blue-400" },
                  { label: "View Reports", icon: BarChart3, href: "/admin/reports", color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Add Category", icon: FolderPlus, href: "/admin/categories", color: "text-purple-600 dark:text-purple-400" },
                  { label: "Manage Technicians", icon: UserCheck, href: "/admin/technicians", color: "text-amber-600 dark:text-amber-400" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl p-3 transition-colors",
                      isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        isDark ? "bg-slate-700" : "bg-slate-100"
                      )}
                    >
                      <action.icon className={cn("h-5 w-5", action.color)} />
                    </div>
                    <span className={cn("flex-1 text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {action.label}
                    </span>
                    <ChevronRight className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
