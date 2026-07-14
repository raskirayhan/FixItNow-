import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Trash2,
  CheckCheck,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useApi";
import EmptyState from "@/components/shared/EmptyState";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@/types";

const typeIconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const typeColorMap = {
  success: "text-emerald-500",
  warning: "text-amber-500",
  error: "text-red-500",
  info: "text-blue-500",
};

const typeBgMap = {
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  error: "bg-red-50",
  info: "bg-blue-50",
};

export default function NotificationCenter() {
  const { isDark } = useThemeContext();
  const queryClient = useQueryClient();
  const { data: notifData, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications: Notification[] = notifData?.data ?? [];
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    markRead.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });
  };

  const markAllAsRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });
  };

  const deleteNotification = (_id: string) => {};

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    if (activeTab === "bookings")
      return n.title.toLowerCase().includes("booking") || n.title.toLowerCase().includes("service");
    if (activeTab === "payments")
      return n.title.toLowerCase().includes("payment") || n.title.toLowerCase().includes("refund");
    if (activeTab === "promotions")
      return n.title.toLowerCase().includes("promo") || n.title.toLowerCase().includes("offer");
    return true;
  });

  return (
    <DashboardLayout role="CUSTOMER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Filter className="h-3.5 w-3.5" />
              All
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredNotifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up! Check back later for updates."
              />
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification, index) => {
                    const Icon = typeIconMap[notification.type];
  if (isLoading) {
    return (
      <DashboardLayout role="CUSTOMER">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          "group flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                          !notification.read
                            ? isDark
                              ? "border-primary-800/50 bg-primary-950/30"
                              : "border-primary-200 bg-primary-50/50"
                            : isDark
                              ? "border-slate-800 bg-slate-900/50 hover:bg-slate-800/50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                            isDark ? "bg-slate-800" : typeBgMap[notification.type]
                          )}
                        >
                          <Icon className={cn("h-5 w-5", typeColorMap[notification.type])} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "text-sm font-semibold",
                                  isDark ? "text-white" : "text-slate-900"
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                              )}
                            </div>
                          </div>
                          <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            {notification.message}
                          </p>
                          <p
                            className={cn(
                              "mt-2 text-xs",
                              isDark ? "text-slate-500" : "text-slate-400"
                            )}
                          >
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="shrink-0 rounded-lg p-2 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
