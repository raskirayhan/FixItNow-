import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Wallet,
  Settings,
  Users,
  BarChart3,
  FileText,
  Shield,
  Wrench,
  Star,
  Bell,
  X,
  ChevronLeft,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { cn, getInitials } from "@/lib/utils";
import type { Role } from "@/types";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Technicians", href: "/admin/technicians", icon: Wrench },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Policies", href: "/admin/policies", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const CUSTOMER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/customer", icon: LayoutDashboard },
  { label: "My Bookings", href: "/customer/bookings", icon: CalendarCheck },
  { label: "Messages", href: "/customer/messages", icon: MessageSquare },
  { label: "Wallet", href: "/customer/wallet", icon: Wallet },
  { label: "Notifications", href: "/customer/notifications", icon: Bell },
  { label: "Settings", href: "/customer/settings", icon: Settings },
];

const TECHNICIAN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/technician", icon: LayoutDashboard },
  { label: "My Services", href: "/technician/services", icon: Wrench },
  { label: "Bookings", href: "/technician/bookings", icon: CalendarCheck },
  { label: "Reviews", href: "/technician/reviews", icon: Star },
  { label: "Messages", href: "/technician/messages", icon: MessageSquare },
  { label: "Wallet", href: "/technician/wallet", icon: Wallet },
  { label: "Notifications", href: "/technician/notifications", icon: Bell },
  { label: "Settings", href: "/technician/settings", icon: Settings },
];

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  CUSTOMER: "Customer",
  TECHNICIAN: "Technician",
};

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  CUSTOMER: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  TECHNICIAN: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400",
};

function getNavItems(role: Role): NavItem[] {
  switch (role) {
    case "ADMIN":
      return ADMIN_NAV;
    case "TECHNICIAN":
      return TECHNICIAN_NAV;
    case "CUSTOMER":
    default:
      return CUSTOMER_NAV;
  }
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { isDark } = useThemeContext();
  const { user } = useAuth();
  const navItems = getNavItems(role);

  const isActive = (href: string) => {
    if (href === `/admin` || href === `/customer` || href === `/technician`) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("flex items-center justify-between border-b px-5 py-4", isDark ? "border-slate-700/50" : "border-slate-200")}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xs shadow-sm">
            FN
          </div>
          <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
            Fix<span className="text-primary-600">It</span>Now
          </span>
        </Link>
        <button
          onClick={onClose}
          className={cn(
            "rounded-lg p-1.5 transition-colors lg:hidden",
            isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
          )}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? isDark
                        ? "bg-primary-900/30 text-primary-400"
                        : "bg-primary-50 text-primary-700"
                      : isDark
                        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary-600 dark:text-primary-400")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {user && (
        <div className={cn("border-t px-4 py-4", isDark ? "border-slate-700/50" : "border-slate-200")}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm font-bold shadow-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                {user.name}
              </p>
              <span className={cn("mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", ROLE_COLORS[role])}>
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col border-r",
          isDark ? "border-slate-700/50 bg-slate-900" : "border-slate-200 bg-white"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 shadow-xl",
                isDark ? "bg-slate-900" : "bg-white"
              )}
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
