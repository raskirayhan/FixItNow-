import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AnimatedCard from "@/components/shared/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency } from "@/lib/utils";
import { useAdminStats, useAdminBookings } from "@/hooks/useApi";

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

const REVENUE_DATA = chartData.monthlyRevenue.slice(-6);
const USER_GROWTH_DATA = chartData.userGrowth.slice(-6);

const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value));
const maxUsers = Math.max(...USER_GROWTH_DATA.map((d) => d.value));

const SERVICE_PERFORMANCE = [
  { name: "Emergency Pipe Repair", bookings: 245, revenue: 36750, growth: 12.5 },
  { name: "Deep Home Cleaning", bookings: 210, revenue: 42000, growth: 8.3 },
  { name: "Interior Room Painting", bookings: 180, revenue: 32400, growth: 15.2 },
  { name: "AC System Tune-up", bookings: 165, revenue: 19800, growth: -3.1 },
  { name: "Electrical Panel Upgrade", bookings: 140, revenue: 70000, growth: 22.4 },
  { name: "Weekly Lawn Maintenance", bookings: 130, revenue: 5850, growth: 5.7 },
];

const BOOKING_TRENDS = [
  { month: "Jan", bookings: 1850, completed: 1720, cancelled: 85 },
  { month: "Feb", bookings: 1980, completed: 1850, cancelled: 90 },
  { month: "Mar", bookings: 2200, completed: 2050, cancelled: 100 },
  { month: "Apr", bookings: 2450, completed: 2280, cancelled: 120 },
  { month: "May", bookings: 2680, completed: 2500, cancelled: 110 },
  { month: "Jun", bookings: 2900, completed: 2720, cancelled: 130 },
];

const maxTrendBookings = Math.max(...BOOKING_TRENDS.map((d) => d.bookings));

export default function AdminReports() {
  const { isDark } = useThemeContext();
  const [dateRange, setDateRange] = useState("6months");

  const { data: statsResp } = useAdminStats();
  const { data: bookingsResp } = useAdminBookings();

  const stats = statsResp?.data ?? { totalUsers: 0, totalTechnicians: 0, totalBookings: 0, totalRevenue: 0, pendingBookings: 0, completedBookings: 0, activeServices: 0, monthlyGrowth: 0 };

  const allBookings = bookingsResp?.data ?? [];

  const derivedStats = useMemo(() => {
    const totalBookings = stats.totalBookings || allBookings.length || 1;
    const completedBookings = stats.completedBookings || allBookings.filter((b: any) => b.status === "COMPLETED").length || 1;
    return {
      totalBookings,
      completedBookings,
      avgRevenuePerBooking: Math.round((stats.totalRevenue || 0) / totalBookings),
    };
  }, [stats, allBookings]);

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
            Reports
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Comprehensive analytics and performance reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className={cn("w-44", isDark && "bg-slate-800 border-slate-700 text-white")}>
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Report */}
        <AnimatedCard delay={0}>
          <Card
            className={cn(
              "border",
              isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  Revenue Report
                </CardTitle>
                <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                  Monthly revenue for the last 6 months
                </p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">+18.2%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Total Revenue</p>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {formatCurrency(REVENUE_DATA.reduce((s, d) => s + d.value, 0))}
                  </p>
                </div>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Average: {formatCurrency(Math.round(REVENUE_DATA.reduce((s, d) => s + d.value, 0) / REVENUE_DATA.length))}/mo
                </p>
              </div>
              <div className="flex items-end justify-between gap-3 h-48">
                {REVENUE_DATA.map((month, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.value / maxRevenue) * 100}%` }}
                      transition={{ delay: 0.3 + idx * 0.08, duration: 0.6 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-700 via-primary-500 to-emerald-400 cursor-pointer group relative"
                    >
                      <div
                        className={cn(
                          "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-10",
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
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => {}}>
                <Download className="mr-2 h-3.5 w-3.5" />
                Export Revenue Report
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* User Growth Report */}
        <AnimatedCard delay={0.1}>
          <Card
            className={cn(
              "border",
              isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                  User Growth Report
                </CardTitle>
                <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                  Cumulative user registrations
                </p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">+12.5%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Total Users</p>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {stats.totalTechnicians}
                    </p>
                    <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Technicians</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {(stats.totalUsers - stats.totalTechnicians).toLocaleString()}
                    </p>
                    <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Customers</p>
                  </div>
                </div>
              </div>
              {/* Line-style chart using CSS */}
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-end justify-between gap-3">
                  {USER_GROWTH_DATA.map((month, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.value / maxUsers) * 100}%` }}
                        transition={{ delay: 0.4 + idx * 0.06, duration: 0.5 }}
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                      />
                      <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Download className="mr-2 h-3.5 w-3.5" />
                Export User Growth Report
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Service Performance */}
        <AnimatedCard delay={0.2}>
          <Card
            className={cn(
              "border",
              isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
            )}
          >
            <CardHeader>
              <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                Service Performance
              </CardTitle>
              <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                Top performing services by revenue
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {SERVICE_PERFORMANCE.map((service, idx) => (
                <div key={service.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold",
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
                        {idx + 1}
                      </span>
                      <div>
                        <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {service.name}
                        </p>
                        <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>
                          {service.bookings} bookings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {formatCurrency(service.revenue)}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-xs font-semibold",
                          service.growth >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {service.growth >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(service.growth)}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(service.revenue / SERVICE_PERFORMANCE[0].revenue) * 100}
                    className="h-2"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Download className="mr-2 h-3.5 w-3.5" />
                Export Service Report
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Booking Trends */}
        <AnimatedCard delay={0.3}>
          <Card
            className={cn(
              "border",
              isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
            )}
          >
            <CardHeader>
              <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                Booking Trends
              </CardTitle>
              <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                Monthly booking activity breakdown
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Total Bookings", value: BOOKING_TRENDS.reduce((s, d) => s + d.bookings, 0).toLocaleString(), color: "text-primary-600" },
                  { label: "Completed", value: BOOKING_TRENDS.reduce((s, d) => s + d.completed, 0).toLocaleString(), color: "text-emerald-600" },
                  { label: "Cancelled", value: BOOKING_TRENDS.reduce((s, d) => s + d.cancelled, 0).toLocaleString(), color: "text-red-500" },
                ].map((stat) => (
                  <div key={stat.label} className={cn("rounded-xl p-3 text-center", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                    <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                    <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Stacked bar chart */}
              <div className="flex items-end justify-between gap-3 h-48">
                {BOOKING_TRENDS.map((month, idx) => {
                  const completedH = (month.completed / maxTrendBookings) * 100;
                  const cancelledH = (month.cancelled / maxTrendBookings) * 100;

                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${completedH + cancelledH}%` }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.6 }}
                        className="w-full flex flex-col overflow-hidden rounded-t-lg"
                      >
                        <div className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400" />
                        <div
                          className="bg-red-400"
                          style={{ height: `${cancelledH > 0 ? (cancelledH / (completedH + cancelledH)) * 100 : 0}%`, minHeight: cancelledH > 0 ? "2px" : 0 }}
                        />
                      </motion.div>
                      <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        {month.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-sm bg-emerald-500" />
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-sm bg-red-400" />
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Cancelled</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Download className="mr-2 h-3.5 w-3.5" />
                Export Booking Trends
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Summary Stats */}
      <AnimatedCard delay={0.4} className="mt-6">
        <Card
          className={cn(
            "border",
            isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader>
            <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
              Platform Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Avg. Revenue/Booking", value: formatCurrency(derivedStats.avgRevenuePerBooking), icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Active Technicians", value: stats.totalTechnicians.toString(), icon: Users, color: "text-blue-600 dark:text-blue-400" },
                { label: "Completion Rate", value: `${derivedStats.totalBookings > 0 ? Math.round((derivedStats.completedBookings / derivedStats.totalBookings) * 100) : 0}%`, icon: CalendarCheck, color: "text-purple-600 dark:text-purple-400" },
                { label: "Monthly Growth", value: `${stats.monthlyGrowth}%`, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-4",
                    isDark ? "bg-slate-700/30" : "bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      isDark ? "bg-slate-700" : "bg-white"
                    )}
                  >
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div>
                    <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {stat.value}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </DashboardLayout>
  );
}
