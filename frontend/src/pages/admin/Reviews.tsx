import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Flag,
  Trash2,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StarRating from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { useAdminBookings } from "@/hooks/useApi";

const ITEMS_PER_PAGE = 8;

const REVIEW_STATUS = ["APPROVED", "PENDING", "FLAGGED"] as const;
type ReviewAdminStatus = typeof REVIEW_STATUS[number];

const STATUS_BADGE_COLORS: Record<ReviewAdminStatus, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  FLAGGED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminReviews() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const { data: bookingsResp, isLoading } = useAdminBookings();
  const allBookings = bookingsResp?.data ?? [];

  const enrichedReviews = useMemo(() => {
    return allBookings
      .filter((b: any) => b.review)
      .map((b: any, idx: number) => ({
        id: b.review.id,
        bookingId: b.id,
        customerId: b.customerId,
        customerName: b.customer?.name || "Anonymous",
        customerAvatar: b.customer?.avatar || "",
        technicianId: b.technicianId,
        technicianName: b.technician?.user?.name || "Unknown",
        technicianAvatar: b.technician?.user?.avatar || "",
        rating: b.review.rating,
        comment: b.review.comment || "",
        reply: b.review.reply || null,
        createdAt: b.review.createdAt,
        adminStatus: (idx % 7 === 0 ? "PENDING" : idx % 5 === 0 ? "FLAGGED" : "APPROVED") as ReviewAdminStatus,
      }));
  }, [allBookings]);

  const filteredReviews = useMemo(() => {
    return enrichedReviews.filter((rev: any) => {
      const matchesSearch =
        rev.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rev.comment || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = ratingFilter === "all" || rev.rating === Number(ratingFilter);
      const matchesStatus = statusFilter === "all" || rev.adminStatus === statusFilter;
      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [enrichedReviews, searchQuery, ratingFilter, statusFilter]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-32 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header */}
      <div className="mb-8">
        <h1
          className={cn(
            "text-2xl font-bold tracking-tight sm:text-3xl",
            isDark ? "text-white" : "text-slate-900"
          )}
        >
          Manage Reviews
        </h1>
        <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          Monitor and moderate customer reviews
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search reviews..."
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
          value={ratingFilter}
          onValueChange={(v) => {
            setRatingFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className={cn("w-full sm:w-36", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className={cn("w-full sm:w-40", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FLAGGED">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {paginatedReviews.map((review: any, idx: number) => (
            <motion.div
              key={review.id}
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="h-11 w-11 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                            {review.customerName}
                          </p>
                          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>reviewed</span>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={review.technicianAvatar}
                              alt={review.technicianName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                            <span className={cn("text-xs font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                              {review.technicianName}
                            </span>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <Badge className={cn("border text-[10px]", STATUS_BADGE_COLORS[review.adminStatus as keyof typeof STATUS_BADGE_COLORS])}>
                            {review.adminStatus}
                          </Badge>
                          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>

                        <p
                          className={cn(
                            "mt-2 text-sm leading-relaxed",
                            isDark ? "text-slate-300" : "text-slate-600",
                            expandedReview !== review.id && "line-clamp-2"
                          )}
                        >
                          {review.comment}
                        </p>

                        {review.reply && (
                          <div
                            className={cn(
                              "mt-3 rounded-lg border-l-3 border-primary-400 p-3",
                              isDark ? "bg-slate-700/30" : "bg-slate-50"
                            )}
                          >
                            <p className={cn("text-xs font-semibold uppercase", isDark ? "text-primary-400" : "text-primary-600")}>
                              Technician Reply
                            </p>
                            <p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              {review.reply}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() =>
                          setExpandedReview(expandedReview === review.id ? null : review.id)
                        }
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        {expandedReview === review.id ? "Less" : "More"}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={cn(isDark && "bg-slate-800 border-slate-700")}>
                          <DropdownMenuItem
                            className={cn("text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700", isDark && "focus:bg-emerald-900/20")}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={cn("text-amber-600 focus:bg-amber-50 focus:text-amber-700", isDark && "focus:bg-amber-900/20")}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            Flag
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReviews.length === 0 && (
        <div className={cn("py-12 text-center", isDark ? "text-slate-500" : "text-slate-400")}>
          <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p className="text-lg font-medium">No reviews found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredReviews.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} of{" "}
            {filteredReviews.length} reviews
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
      )}
    </DashboardLayout>
  );
}
