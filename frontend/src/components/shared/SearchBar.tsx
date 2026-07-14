import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export default function SearchBar({
  placeholder = "Search services...",
  value: controlledValue,
  onChange,
  onFilterClick,
}: SearchBarProps) {
  const { isDark } = useThemeContext();
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <motion.div
      animate={{ width: focused ? "100%" : "100%" }}
      className={cn(
        "flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-300",
        focused
          ? "border-primary-500 ring-2 ring-primary-500/20 shadow-sm"
          : isDark
            ? "border-slate-700 bg-slate-800 hover:border-slate-600"
            : "border-slate-200 bg-slate-50 hover:border-slate-300"
      )}
    >
      <Search
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          focused
            ? "text-primary-500"
            : isDark
              ? "text-slate-500"
              : "text-slate-400"
        )}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent text-sm outline-none",
          isDark
            ? "text-white placeholder-slate-500"
            : "text-slate-900 placeholder-slate-400"
        )}
      />
      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className={cn(
            "shrink-0 rounded-lg p-1.5 transition-colors",
            isDark
              ? "text-slate-400 hover:bg-slate-700 hover:text-white"
              : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}
