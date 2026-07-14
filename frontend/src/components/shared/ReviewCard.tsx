import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, Calendar } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatDate } from "@/lib/utils";
import StarRating from "@/components/shared/StarRating";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { isDark } = useThemeContext();
  const [helpfulCount, setHelpfulCount] = useState(review.helpful ?? 0);
  const [markedHelpful, setMarkedHelpful] = useState(false);

  const handleHelpful = () => {
    if (!markedHelpful) {
      setHelpfulCount((c) => c + 1);
      setMarkedHelpful(true);
    } else {
      setHelpfulCount((c) => c - 1);
      setMarkedHelpful(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors",
        isDark
          ? "border-slate-700/50 bg-slate-800"
          : "border-slate-200 bg-white"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm font-bold">
            {review.customer?.avatar ? (
              <img
                src={review.customer.avatar}
                alt={review.customer.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              review.customer?.name.charAt(0) || "U"
            )}
          </div>
          <div>
            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
              {review.customer?.name || "Anonymous"}
            </p>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className={cn("flex items-center gap-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                <Calendar className="h-3 w-3" />
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className={cn("mt-4 text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
          {review.comment}
        </p>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {review.photos.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`Review photo ${idx + 1}`}
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* Helpful Button */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            markedHelpful
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              : isDark
                ? "text-slate-400 hover:bg-slate-700"
                : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", markedHelpful && "fill-current")} />
          Helpful ({helpfulCount})
        </button>
      </div>

      {/* Reply */}
      {review.reply && (
        <div
          className={cn(
            "mt-4 rounded-xl border-l-4 border-primary-400 p-4",
            isDark ? "bg-slate-700/30" : "bg-slate-50"
          )}
        >
          <p className={cn("text-xs font-semibold uppercase tracking-wide", isDark ? "text-primary-400" : "text-primary-600")}>
            Technician Reply
          </p>
          <p className={cn("mt-1 text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
            {review.reply}
          </p>
        </div>
      )}
    </div>
  );
}
