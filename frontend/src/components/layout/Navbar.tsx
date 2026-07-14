import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useApi";
import type { Notification } from "@/types";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: notifData } = useNotifications();
  const notifNotifications: Notification[] = notifData?.data ?? [];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "CUSTOMER":
        return "/customer";
      case "TECHNICIAN":
        return "/technician";
      case "ADMIN":
        return "/admin";
      default:
        return "/";
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? isDark
              ? "glass-dark border-b border-white/10 shadow-lg"
              : "glass border-b border-slate-200/50 shadow-sm"
            : isDark
              ? "bg-slate-900/80 backdrop-blur-sm"
              : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-sm shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              FN
            </div>
            <span className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Fix<span className="text-primary-600">It</span>Now
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    : isDark
                      ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Search Bar */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300",
                searchFocused
                  ? "w-64 border-primary-500 ring-2 ring-primary-500/20"
                  : "w-48 border-slate-200 dark:border-slate-700",
                isDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"
              )}
            >
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm outline-none placeholder:opacity-50"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "rounded-lg p-2.5 transition-colors",
                isDark
                  ? "text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className={cn(
                      "relative rounded-lg p-2.5 transition-colors",
                      isDark
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl",
                          isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
                        )}
                      >
                        <div className={cn("border-b px-4 py-3", isDark ? "border-slate-700" : "border-slate-100")}>
                          <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={cn(
                                "border-b px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50",
                                !notif.read && (isDark ? "bg-primary-900/10" : "bg-primary-50/50"),
                                isDark ? "border-slate-700/50" : "border-slate-100"
                              )}
                            >
                              <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                {notif.title}
                              </p>
                              <p className={cn("mt-0.5 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                {notif.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", userMenuOpen && "rotate-180", isDark ? "text-slate-400" : "text-slate-500")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl",
                          isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
                        )}
                      >
                        <div className={cn("border-b px-4 py-3", isDark ? "border-slate-700" : "border-slate-100")}>
                          <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{user.name}</p>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                              isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            to={getDashboardLink()}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                              isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </div>
                        <div className={cn("border-t py-1", isDark ? "border-slate-700" : "border-slate-100")}>
                          <button
                            onClick={handleLogout}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                              "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            )}
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-700">
                <Link
                  to="/login"
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Log In
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-5 !text-sm !rounded-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={cn(
              "rounded-lg p-2 transition-colors md:hidden",
              isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed top-[60px] left-0 right-0 border-b shadow-xl",
                isDark
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto max-w-7xl px-4 py-4">
                {/* Mobile Search */}
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 mb-3",
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-300"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  )}
                >
                  <Search className="h-4 w-4 opacity-50" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        : isDark
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className={cn("my-3 border-t", isDark ? "border-slate-700" : "border-slate-100")} />

                {isAuthenticated && user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{user.name}</p>
                        <p className="text-xs text-primary-600 font-medium capitalize">{user.role.toLowerCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className={cn("my-3 border-t", isDark ? "border-slate-700" : "border-slate-100")} />
                    <Link
                      to="/login"
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="mt-2 block rounded-xl bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[60px]" />
    </>
  );
}
