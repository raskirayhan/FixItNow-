import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "fixitnow_cookie_consent";

export default function CookieConsent() {
  const { isDark } = useThemeContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const handleManage = () => {
    localStorage.setItem(STORAGE_KEY, "managed");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div
            className={cn(
              "mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border p-5 shadow-2xl sm:flex-row sm:items-center sm:gap-5",
              isDark
                ? "border-slate-700 bg-slate-800"
                : "border-slate-200 bg-white"
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Cookie className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="flex-1">
              <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                We use cookies
              </p>
              <p className={cn("mt-1 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={handleManage}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  isDark
                    ? "text-slate-300 hover:bg-slate-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Manage
              </button>
              <button
                onClick={handleAccept}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Accept All
              </button>
            </div>

            <button
              onClick={handleAccept}
              className={cn(
                "absolute right-3 top-3 rounded-lg p-1 transition-colors sm:relative sm:right-auto sm:top-auto",
                isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
