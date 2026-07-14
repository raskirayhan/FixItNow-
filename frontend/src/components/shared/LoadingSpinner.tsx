import { motion } from "framer-motion";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const SIZE_MAP = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const BORDER_MAP = {
  sm: "border-2",
  md: "border-3",
  lg: "border-4",
};

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const { isDark } = useThemeContext();

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={cn(
          "rounded-full border-primary-200 border-t-primary-600",
          SIZE_MAP[size],
          BORDER_MAP[size],
          isDark && "border-primary-800 border-t-primary-400"
        )}
      />
      {text && (
        <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
          {text}
        </p>
      )}
    </div>
  );
}
