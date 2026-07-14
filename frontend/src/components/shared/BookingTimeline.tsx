import { Check } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

interface BookingTimelineProps {
  currentStatus: BookingStatus;
}

const STEPS: { status: BookingStatus; label: string }[] = [
  { status: "REQUESTED", label: "Request Sent" },
  { status: "ACCEPTED", label: "Accepted" },
  { status: "PAID", label: "Paid" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "COMPLETED", label: "Completed" },
];

const STATUS_ORDER: Record<BookingStatus, number> = {
  REQUESTED: 0,
  ACCEPTED: 1,
  DECLINED: -1,
  PAID: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELLED: -1,
};

export default function BookingTimeline({ currentStatus }: BookingTimelineProps) {
  const { isDark } = useThemeContext();
  const currentIdx = STATUS_ORDER[currentStatus];
  const isCancelledOrDeclined = currentStatus === "CANCELLED" || currentStatus === "DECLINED";

  return (
    <div className="w-full">
      {isCancelledOrDeclined && (
        <div
          className={cn(
            "mb-4 rounded-xl border p-3 text-center text-sm font-medium",
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400"
          )}
        >
          This booking has been {currentStatus === "CANCELLED" ? "cancelled" : "declined"}.
        </div>
      )}

      <div className="flex items-start">
        {STEPS.map((step, idx) => {
          const stepIdx = STATUS_ORDER[step.status];
          const isCompleted = !isCancelledOrDeclined && stepIdx <= currentIdx;
          const isCurrent = step.status === currentStatus;

          return (
            <div key={step.status} className="flex flex-1 flex-col items-center">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={cn(
                    "absolute h-0.5 w-full",
                    isDark ? "bg-slate-700" : "bg-slate-200"
                  )}
                  style={{
                    top: "16px",
                    left: "0",
                    right: "0",
                  }}
                />
              )}

              <div className="relative flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    isCompleted
                      ? "border-primary-500 bg-primary-500 text-white"
                      : isCurrent
                        ? "border-primary-500 bg-white text-primary-600 dark:bg-slate-900"
                        : isDark
                          ? "border-slate-600 bg-slate-800 text-slate-500"
                          : "border-slate-300 bg-white text-slate-400"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Label */}
                <p
                  className={cn(
                    "mt-2 text-xs font-medium text-center whitespace-nowrap",
                    isCompleted
                      ? "text-primary-600 dark:text-primary-400"
                      : isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
