import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, interpolate } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  decimals?: number;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  decimals = 0,
}: StatCardProps) {
  const { isDark } = useThemeContext();
  const ref = { current: null as HTMLDivElement | null };
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const timer = setTimeout(() => {
      setHasAnimated(true);
      const duration = 1200;
      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(interpolate(0, value, eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, 200);

    return () => clearTimeout(timer);
  }, [value, hasAnimated]);

  const formattedValue =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString();

  const trendPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-shadow duration-300 hover:shadow-lg",
        isDark
          ? "border-slate-700/50 bg-slate-800/80 backdrop-blur-sm"
          : "border-slate-200 bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
            {label}
          </p>
          <p className={cn("mt-2 text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
            {prefix}
            {formattedValue}
            {suffix}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {trendPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  trendPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trendPositive ? "+" : ""}
                {trend}%
              </span>
              <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            isDark
              ? "bg-primary-900/30 text-primary-400"
              : "bg-primary-100 text-primary-600"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-10 blur-2xl",
          "bg-primary-500"
        )}
      />
    </motion.div>
  );
}
