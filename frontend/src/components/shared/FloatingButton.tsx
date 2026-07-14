import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FloatingButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

export default function FloatingButton({
  icon: Icon,
  label,
  onClick,
  color = "bg-primary-600 hover:bg-primary-700",
}: FloatingButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="relative">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-slate-700"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-200 hover:shadow-2xl",
            color
          )}
        >
          <Icon className="h-6 w-6" />
        </button>
      </div>
    </motion.div>
  );
}
