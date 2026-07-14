import { useState } from "react";
import { Menu } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import type { Role } from "@/types";

interface DashboardLayoutProps {
  role: Role;
  children: React.ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useThemeContext();

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div
          className={cn(
            "sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 lg:hidden",
            isDark
              ? "border-slate-800 bg-slate-900/90 backdrop-blur-md"
              : "border-slate-200 bg-white/90 backdrop-blur-md"
          )}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={cn(
              "rounded-lg p-2 transition-colors",
              isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
            Dashboard
          </span>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
