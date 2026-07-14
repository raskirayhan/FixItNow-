import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Play,
  Eye,
  AlertCircle,
  Zap,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import AnimatedCard from "@/components/shared/AnimatedCard";
import StarRating from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useTechnicianBookings, useUpdateBookingStatus } from "@/hooks/useApi";
import queryClient from "@/lib/queryClient";
import type { BookingStatus } from "@/types";

const MOCK_TECHNICIAN = {
  id: "tech-1",
  user: { name: "James Wilson" },
  rating: 4.9,
  totalReviews: 128,
  completedJobs: 347,
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  REQUESTED: "bg-amber-100 text-amber-700 border-amber-200",
  ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PAID: "bg-purple-100 text-purple-700 border-purple-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  DECLINED: "bg-red-100 text-red-700 border-red-200",
};

const WEEKLY_EARNINGS = [
  { day: "Mon", amount: 150 },
  { day: "Tue", amount: 280 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 350 },
  { day: "Fri", amount: 200 },
  { day: "Sat", amount: 450 },
  { day: "Sun", amount: 0 },
];

const MONTHLY_EARNINGS = [
  { label: "Jan", value: 3200 },
  { label: "Feb", value: 4100 },
  { label: "Mar", value: 3800 },
  { label: "Apr", value: 5200 },
  { label: "May", value: 4700 },
  { label: "Jun", value: 5500 },
];

function getStatusBadgeClass(status: BookingStatus): string {
  return STATUS_COLORS[status] || "bg-slate-100 text-slate-700";
}

export default function TechnicianDashboard() {
  const { isDark } = useThemeContext();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobFilter, setJobFilter] = useState<"all" | "pending" | "active" | "completed">("all");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data: bookingsResp, isLoading: bookingsLoading } = useTechnicianBookings();
  const updateStatus = useUpdateBookingStatus();

  const myBookings = useMemo(() => bookingsResp?.data ?? [], [bookingsResp]);

  const todayJobs = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return myBookings.filter((b: any) => b.scheduledAt?.startsWith(today));
  }, [myBookings]);

  const pendingRequests = useMemo(
    () => myBookings.filter((b: any) => b.status === "REQUESTED"),
    [myBookings]
  );

  const filteredJobs = useMemo(() => {
    switch (jobFilter) {
      case "pending":
        return myBookings.filter((b: any) => b.status === "REQUESTED" || b.status === "ACCEPTED");
      case "active":
        return myBookings.filter((b: any) => b.status === "IN_PROGRESS" || b.status === "PAID");
      case "completed":
        return myBookings.filter((b: any) => b.status === "COMPLETED");
      default:
        return myBookings;
    }
  }, [myBookings, jobFilter]);

  const thisWeekEarnings = WEEKLY_EARNINGS.reduce((sum, d) => sum + d.amount, 0);
  const maxWeeklyAmount = Math.max(...WEEKLY_EARNINGS.map((d) => d.amount));
  const maxMonthlyAmount = Math.max(...MONTHLY_EARNINGS.map((d) => d.value));

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { blanks, days, year, month };
  }, [calendarMonth]);

  const calendarJobDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const days = new Set<number>();
    myBookings.forEach((b: any) => {
      const d = new Date(b.scheduledAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        days.add(d.getDate());
      }
    });
    return days;
  }, [myBookings, calendarMonth]);

  const selectedDayJobs = useMemo(() => {
    if (selectedCalendarDay === null) return [];
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    return myBookings.filter((b: any) => {
      const d = new Date(b.scheduledAt);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedCalendarDay;
    });
  }, [myBookings, calendarMonth, selectedCalendarDay]);

  const completionRate = useMemo(() => {
    const completed = myBookings.filter((b: any) => b.status === "COMPLETED").length;
    const total = myBookings.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [myBookings]);

  const monthlyEarningsTotal = MONTHLY_EARNINGS.reduce((sum, m) => sum + m.value, 0);

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
    setSelectedCalendarDay(null);
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
    setSelectedCalendarDay(null);
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["technicianBookings"] });
        },
      }
    );
  };

  const monthlyEarningsStat = myBookings
    .filter((b: any) => b.status === "COMPLETED")
    .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

  if (bookingsLoading) {
    return (
      <DashboardLayout role="TECHNICIAN">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-24 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="TECHNICIAN">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Welcome back, {MOCK_TECHNICIAN.user.name}!
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            {todayStr}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              isOnline ? "text-emerald-600" : "text-slate-400"
            )}
          >
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
              )}
            />
            {isOnline ? "Online" : "Offline"}
          </span>
          <Switch checked={isOnline} onCheckedChange={setIsOnline} />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Today's Jobs" value={todayJobs.length || 3} trend={8} />
        <StatCard icon={DollarSign} label="Monthly Earnings" value={monthlyEarningsStat || 5500} prefix="$" trend={12.5} />
        <StatCard icon={Clock} label="Pending Requests" value={pendingRequests.length || 2} trend={-5} />
        <StatCard icon={Star} label="Average Rating" value={MOCK_TECHNICIAN.rating} decimals={1} trend={2.1} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Today's Schedule */}
            <AnimatedCard delay={0} className="lg:col-span-2">
              <Card
                className={cn(
                  "border",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        time: "09:00 AM",
                        customer: "Sarah Johnson",
                        service: "Emergency Pipe Repair",
                        status: "COMPLETED" as BookingStatus,
                        location: "123 Maple Ave, Brooklyn",
                      },
                      {
                        time: "12:30 PM",
                        customer: "Mike Chen",
                        service: "Electrical Panel Upgrade",
                        status: "IN_PROGRESS" as BookingStatus,
                        location: "456 Oak St, Queens",
                      },
                      {
                        time: "03:00 PM",
                        customer: "Emily Davis",
                        service: "Water Heater Installation",
                        status: "REQUESTED" as BookingStatus,
                        location: "789 Pine Rd, Manhattan",
                      },
                    ].map((job, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "flex items-start gap-4 rounded-xl border p-4 transition-colors",
                          isDark
                            ? "border-slate-700/50 hover:bg-slate-700/30"
                            : "border-slate-100 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <span className={cn("text-sm font-bold", isDark ? "text-primary-400" : "text-primary-600")}>
                            {job.time}
                          </span>
                          <div className="mt-2 h-8 w-0.5 rounded-full bg-primary-200 dark:bg-primary-800" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                              {job.customer}
                            </p>
                            <Badge className={cn("border text-[10px]", getStatusBadgeClass(job.status))}>
                              {job.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            {job.service}
                          </p>
                          <p className={cn("mt-1 flex items-center gap-1 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Quick Earnings */}
            <AnimatedCard delay={0.1}>
              <Card
                className={cn(
                  "border h-full",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                    Quick Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-center">
                    <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {formatCurrency(thisWeekEarnings)}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      This week's earnings
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-40">
                    {WEEKLY_EARNINGS.map((day, idx) => (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: day.amount > 0 ? `${(day.amount / maxWeeklyAmount) * 100}%` : "4px",
                          }}
                          transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                          className={cn(
                            "w-full rounded-t-md",
                            day.amount > 0
                              ? "bg-gradient-to-t from-primary-600 to-primary-400"
                              : isDark
                                ? "bg-slate-700"
                                : "bg-slate-200"
                          )}
                        />
                        <span className={cn("text-[10px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                          {day.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Pending Requests */}
            <AnimatedCard delay={0.2} className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
              <Card
                className={cn(
                  "border",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingRequests.slice(0, 3).length === 0 ? (
                      <p className={cn("text-center text-sm py-4", isDark ? "text-slate-400" : "text-slate-500")}>
                        No pending requests
                      </p>
                    ) : (
                      pendingRequests.slice(0, 3).map((req: any, idx: number) => (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className={cn(
                            "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
                            isDark ? "border-slate-700/50" : "border-slate-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={req.customer?.avatar || "https://i.pravatar.cc/150?img=5"}
                              alt={req.customer?.name || "Customer"}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className={cn("font-semibold text-sm", isDark ? "text-white" : "text-slate-900")}>
                                {req.customer?.name || "Customer"}
                              </p>
                              <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                {req.service?.title || "Service"} &middot; {formatDate(req.scheduledAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                              {formatCurrency(req.totalAmount)}
                            </span>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleStatusChange(req.id, "ACCEPTED")}
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(req.id, "DECLINED")}
                              disabled={updateStatus.isPending}
                            >
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                              Decline
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Performance Summary */}
            <AnimatedCard delay={0.3} className="lg:row-start-2">
              <Card
                className={cn(
                  "border h-full",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={isDark ? "text-slate-400" : "text-slate-500"}>Completion Rate</span>
                      <span className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={isDark ? "text-slate-400" : "text-slate-500"}>Customer Satisfaction</span>
                      <span className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>97%</span>
                    </div>
                    <Progress value={97} className="h-2" indicatorClassName="bg-emerald-600" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total Reviews</span>
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={MOCK_TECHNICIAN.rating} size="sm" />
                      <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {MOCK_TECHNICIAN.rating} ({MOCK_TECHNICIAN.totalReviews})
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Completed Jobs</span>
                    <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {MOCK_TECHNICIAN.completedJobs}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "pending", "active", "completed"] as const).map((filter) => (
              <Button
                key={filter}
                variant={jobFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setJobFilter(filter)}
                className={cn(
                  jobFilter === filter && "bg-primary-600 text-white hover:bg-primary-700"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredJobs.map((booking: any, idx: number) => {
                const service = booking.service;
                const customer = booking.customer;

                const isExpanded = expandedJob === booking.id;

                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "border transition-shadow hover:shadow-md",
                        isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                      )}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={customer?.avatar || ""}
                              alt={customer?.name || "Customer"}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div>
                              <p className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                {customer?.name || "Customer"}
                              </p>
                              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                {service?.title || "Service"}
                              </p>
                              <div className="mt-1 flex items-center gap-3">
                                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                  <Calendar className="mr-1 inline h-3 w-3" />
                                  {formatDate(booking.scheduledAt)}
                                </span>
                                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                  {booking.timeSlot}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={cn("border text-[10px]", getStatusBadgeClass(booking.status))}>
                              {booking.status.replace("_", " ")}
                            </Badge>
                            <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {booking.status === "REQUESTED" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleStatusChange(booking.id, "ACCEPTED")}
                                disabled={updateStatus.isPending}
                              >
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusChange(booking.id, "DECLINED")}
                                disabled={updateStatus.isPending}
                              >
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Decline
                              </Button>
                            </>
                          )}
                          {booking.status === "ACCEPTED" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleStatusChange(booking.id, "IN_PROGRESS")}
                              disabled={updateStatus.isPending}
                            >
                              <Play className="mr-1 h-3.5 w-3.5" />
                              Start Job
                            </Button>
                          )}
                          {booking.status === "PAID" && (
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() => handleStatusChange(booking.id, "IN_PROGRESS")}
                              disabled={updateStatus.isPending}
                            >
                              <Zap className="mr-1 h-3.5 w-3.5" />
                              Mark In Progress
                            </Button>
                          )}
                          {booking.status === "IN_PROGRESS" && (
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Mark Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedJob(isExpanded ? null : booking.id)}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View Details
                          </Button>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <Separator className="my-4" />
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                                    Address
                                  </p>
                                  <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                                    {booking.address || "No address provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                                    Notes
                                  </p>
                                  <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                                    {booking.notes || "No notes"}
                                  </p>
                                </div>
                                <div>
                                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                                    Booking ID
                                  </p>
                                  <p className={cn("text-sm font-mono", isDark ? "text-slate-300" : "text-slate-600")}>
                                    {booking.id}
                                  </p>
                                </div>
                                <div>
                                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                                    Created
                                  </p>
                                  <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                                    {formatDate(booking.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card
            className={cn(
              "border",
              isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {calendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className={cn(
                      "py-2 text-center text-xs font-semibold",
                      isDark ? "text-slate-500" : "text-slate-400"
                    )}
                  >
                    {day}
                  </div>
                ))}
                {calendarDays.blanks.map((blank) => (
                  <div key={`blank-${blank}`} />
                ))}
                {calendarDays.days.map((day) => {
                  const hasJob = calendarJobDays.has(day);
                  const isSelected = selectedCalendarDay === day;
                  const isToday =
                    day === today.getDate() &&
                    calendarMonth.getMonth() === today.getMonth() &&
                    calendarMonth.getFullYear() === today.getFullYear();

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedCalendarDay(isSelected ? null : day)}
                      className={cn(
                        "relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all",
                        isSelected
                          ? "bg-primary-600 text-white"
                          : isToday
                            ? isDark
                              ? "bg-primary-900/30 text-primary-400"
                              : "bg-primary-50 text-primary-700"
                            : isDark
                              ? "text-slate-300 hover:bg-slate-700"
                              : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {day}
                      {hasJob && (
                        <span
                          className={cn(
                            "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                            isSelected ? "bg-white" : "bg-primary-500"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedCalendarDay !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6"
                >
                  <Separator className="mb-4" />
                  <h4 className={cn("text-sm font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                    Jobs on {calendarMonth.toLocaleString("en-US", { month: "long" })} {selectedCalendarDay}
                  </h4>
                  {selectedDayJobs.length === 0 ? (
                    <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                      No jobs scheduled for this day.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDayJobs.map((booking: any) => {
                        const service = booking.service;
                        return (
                          <div
                            key={booking.id}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-3",
                              isDark ? "border-slate-700/50" : "border-slate-100"
                            )}
                          >
                            <div>
                              <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                {service?.title || "Service"}
                              </p>
                              <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                {booking.timeSlot}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={cn("border text-[10px]", getStatusBadgeClass(booking.status))}>
                                {booking.status.replace("_", " ")}
                              </Badge>
                              <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                                {formatCurrency(booking.totalAmount)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Earnings Chart */}
            <AnimatedCard delay={0}>
              <Card
                className={cn(
                  "border",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                    Monthly Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-end">
                    <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {formatCurrency(monthlyEarningsTotal)}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {MONTHLY_EARNINGS.map((month, idx) => (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                        <span className={cn("text-[10px] font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                          {formatCurrency(month.value)}
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(month.value / maxMonthlyAmount) * 100}%` }}
                          transition={{ delay: 0.2 + idx * 0.05, duration: 0.6 }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-primary-700 to-primary-400"
                        />
                        <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                          {month.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Completion & Rating */}
            <AnimatedCard delay={0.1}>
              <Card
                className={cn(
                  "border",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 shrink-0">
                      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={isDark ? "#334155" : "#e2e8f0"}
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${completionRate * 2.51} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                          {completionRate}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        Completion Rate
                      </p>
                      <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {myBookings.filter((b: any) => b.status === "COMPLETED").length} / {myBookings.length}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-6">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                      <div className="text-center text-white">
                        <p className="text-2xl font-bold">{MOCK_TECHNICIAN.rating}</p>
                        <Star className="mx-auto h-3 w-3 fill-white" />
                      </div>
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        Average Rating
                      </p>
                      <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {MOCK_TECHNICIAN.totalReviews} reviews
                      </p>
                    </div>
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
                <CardContent className="space-y-4">
                  {(() => {
                    const serviceMap = new Map<string, { title: string; count: number }>();
                    myBookings.forEach((b: any) => {
                      const svc = b.service;
                      if (svc) {
                        const existing = serviceMap.get(svc.id);
                        if (existing) {
                          existing.count++;
                        } else {
                          serviceMap.set(svc.id, { title: svc.title, count: 1 });
                        }
                      }
                    });
                    const topServices = Array.from(serviceMap.values()).sort((a, b) => b.count - a.count).slice(0, 4);
                    return topServices.map((svc, idx) => {
                      const percentage = myBookings.length > 0 ? Math.round((svc.count / myBookings.length) * 100) : 0;
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1.5">
                            <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                              {svc.title}
                            </p>
                            <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              {svc.count} bookings
                            </span>
                          </div>
                          <Progress value={percentage || (4 - idx) * 20} className="h-2" />
                        </div>
                      );
                    });
                  })()}
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Customer Satisfaction */}
            <AnimatedCard delay={0.3}>
              <Card
                className={cn(
                  "border",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "text-slate-900")}>
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { stars: 5, count: 85, color: "bg-emerald-500" },
                    { stars: 4, count: 30, color: "bg-emerald-400" },
                    { stars: 3, count: 8, color: "bg-yellow-500" },
                    { stars: 2, count: 3, color: "bg-orange-500" },
                    { stars: 1, count: 2, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className={cn("w-8 text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        {item.stars} <Star className="inline h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </span>
                      <div className="flex-1">
                        <div className={cn("h-2.5 w-full rounded-full", isDark ? "bg-slate-700" : "bg-slate-100")}>
                          <div
                            className={cn("h-2.5 rounded-full transition-all", item.color)}
                            style={{ width: `${(item.count / 85) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className={cn("w-8 text-right text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="text-center">
                    <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>97%</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Overall Satisfaction</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
