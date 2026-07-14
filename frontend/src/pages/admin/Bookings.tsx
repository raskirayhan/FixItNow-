import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAdminBookings } from "@/hooks/useApi";
import type { BookingStatus } from "@/types";

const ITEMS_PER_PAGE = 10;

const STATUS_BADGE_COLORS: Record<BookingStatus, string> = {
  REQUESTED: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  PAID: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  CANCELLED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  DECLINED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminBookings() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: bookingsResp, isLoading } = useAdminBookings();
  const allBookings = bookingsResp?.data ?? [];

  const filteredBookings = useMemo(() => {
    return allBookings.filter((bk: any) => {
      const customerName = bk.customer?.name || "";
      const technicianName = bk.technician?.user?.name || "";
      const serviceName = bk.service?.title || "";
      const matchesSearch =
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bk.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || bk.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allBookings, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
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
            Manage Bookings
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            View and manage all bookings on the platform
          </p>
        </div>
        <Button variant="outline" className={cn(isDark && "border-slate-700 text-slate-300")}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search bookings..."
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
            <SelectItem value="REQUESTED">Requested</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
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
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>ID</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Customer</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Technician</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Service</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Date</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Amount</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                  <th className={cn("px-6 py-4 font-medium text-right", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {paginatedBookings.map((bk: any, idx: number) => (
                    <motion.tr
                      key={bk.id}
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
                        {bk.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={bk.customer?.avatar || ""} alt="" className="h-7 w-7 rounded-full object-cover" />
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{bk.customer?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={bk.technician?.user?.avatar || ""} alt="" className="h-7 w-7 rounded-full object-cover" />
                          <span className={cn(isDark ? "text-slate-300" : "text-slate-600")}>{bk.technician?.user?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className={cn("px-6 py-4 max-w-[150px] truncate", isDark ? "text-slate-300" : "text-slate-600")}>
                        {bk.service?.title || "Unknown"}
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-slate-400" : "text-slate-500")}>
                        {formatDate(bk.scheduledAt)}
                      </td>
                      <td className={cn("px-6 py-4 font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        {formatCurrency(bk.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("border text-[10px]", STATUS_BADGE_COLORS[bk.status as BookingStatus])}>
                          {bk.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedBooking(bk);
                              setDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
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
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredBookings.length)} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
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

      {/* Booking Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={cn("sm:max-w-lg", isDark && "bg-slate-800 border-slate-700")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>Booking Details</DialogTitle>
            <DialogDescription>Complete information about this booking</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={cn("font-mono text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  {selectedBooking.id}
                </span>
                <Badge className={cn("border text-[10px]", STATUS_BADGE_COLORS[selectedBooking.status as BookingStatus])}>
                  {selectedBooking.status.replace("_", " ")}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Customer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={selectedBooking.customer?.avatar || ""} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {selectedBooking.customer?.name || "Unknown"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Technician</p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={selectedBooking.technician?.user?.avatar || ""} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {selectedBooking.technician?.user?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Service</p>
                <p className={cn("text-sm font-medium mt-1", isDark ? "text-white" : "text-slate-900")}>
                  {selectedBooking.service?.title || "Unknown"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Scheduled Date</p>
                  <p className={cn("text-sm mt-1", isDark ? "text-white" : "text-slate-900")}>
                    {formatDate(selectedBooking.scheduledAt)}
                  </p>
                </div>
                <div>
                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Time Slot</p>
                  <p className={cn("text-sm mt-1", isDark ? "text-white" : "text-slate-900")}>
                    {selectedBooking.timeSlot || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Address</p>
                <p className={cn("text-sm mt-1", isDark ? "text-white" : "text-slate-900")}>
                  {selectedBooking.address || "No address provided"}
                </p>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>Notes</p>
                  <p className={cn("text-sm mt-1", isDark ? "text-slate-300" : "text-slate-600")}>
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
                <span className={cn("text-sm font-medium", isDark ? "text-primary-300" : "text-primary-700")}>
                  Total Amount
                </span>
                <span className={cn("text-xl font-bold", isDark ? "text-primary-300" : "text-primary-700")}>
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className={cn(isDark && "border-slate-700 text-slate-300")}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
