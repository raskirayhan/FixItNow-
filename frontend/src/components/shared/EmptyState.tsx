import { motion } from "framer-motion";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const { isDark } = useThemeContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center",
        isDark
          ? "border-slate-700 bg-slate-800/30"
          : "border-slate-300 bg-slate-50"
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl",
          isDark
            ? "bg-slate-700 text-slate-400"
            : "bg-slate-100 text-slate-400"
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h3 className={cn("mt-4 text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
        {title}
      </h3>
      <p className={cn("mt-1.5 max-w-sm text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        {description}
      </p>
      {action && (
        <a
          href={action.href}
          className="btn-primary mt-6 inline-flex items-center gap-2 !text-sm"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </a>
      )}
    </motion.div>
  );
}
