import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

type ToastOptions = Omit<Toast, "id">;

const TOAST_ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const TOAST_STYLES: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-blue-200 bg-blue-50",
};

let toastCounter = 0;
let listeners: Array<(toasts: Toast[]) => void> = [];
let toastsStore: Toast[] = [];

function notifyListeners() {
  for (const listener of listeners) {
    listener([...toastsStore]);
  }
}

function addToast(options: ToastOptions): string {
  const id = `toast-${++toastCounter}`;
  const toast: Toast = { ...options, id };
  toastsStore = [...toastsStore, toast];
  notifyListeners();

  const duration = options.duration ?? 5000;
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

function removeToast(id: string) {
  toastsStore = toastsStore.filter((t) => t.id !== id);
  notifyListeners();
}

function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>(toastsStore);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const toast = React.useCallback((options: ToastOptions) => {
    return addToast(options);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    removeToast(id);
  }, []);

  const success = React.useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "success" }),
    [toast]
  );

  const error = React.useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "error" }),
    [toast]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "warning" }),
    [toast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "info" }),
    [toast]
  );

  return { toasts, toast, dismiss, success, error, warning, info };
}

function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>(toastsStore);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 sm:max-w-md">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm",
              TOAST_STYLES[t.variant]
            )}
          >
            <div className="mt-0.5 shrink-0">{TOAST_ICONS[t.variant]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{t.title}</p>
              {t.description && (
                <p className="mt-1 text-sm text-slate-600">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded-md p-1 text-slate-400 opacity-70 transition-opacity hover:text-slate-900 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function toast(options: { title?: string; description?: string; variant?: "default" | "success" | "error" | "warning" }) {
  return addToast({ title: options.title ?? "", description: options.description, variant: (options.variant as ToastVariant) ?? "info" });
}

export { useToast, Toaster, type Toast, type ToastVariant, type ToastOptions };
