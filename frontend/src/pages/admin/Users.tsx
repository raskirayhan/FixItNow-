import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users as UsersIcon,
  UserCheck,
  UserX,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { useAdminUsers, useAdminBanUser } from "@/hooks/useApi";
import queryClient from "@/lib/queryClient";
import type { Role, UserStatus } from "@/types";

const ITEMS_PER_PAGE = 10;

const ROLE_BADGE_COLORS: Record<Role, string> = {
  CUSTOMER: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50",
  TECHNICIAN: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
  ADMIN: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50",
};

const STATUS_BADGE_COLORS: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
  BANNED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
};

export default function AdminUsers() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: usersResp, isLoading } = useAdminUsers();
  const banUser = useAdminBanUser();

  const ALL_USERS = useMemo(() => usersResp?.data ?? [], [usersResp]);

  const filteredUsers = useMemo(() => {
    return ALL_USERS.filter((user: any) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [ALL_USERS, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleBanToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
    banUser.mutate(
      { id: userId, status: newStatus },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
          setDialogOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-16 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header */}
      <div className="mb-8">
        <h1
          className={cn(
            "text-2xl font-bold tracking-tight sm:text-3xl",
            isDark ? "text-white" : "text-slate-900"
          )}
        >
          Manage Users
        </h1>
        <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          View and manage all registered users on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "pl-10",
              isDark && "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            )}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className={cn("w-full sm:w-40", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="TECHNICIAN">Technician</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className={cn("w-full sm:w-40", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card
        className={cn(
          "border",
          isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
        )}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={cn("border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>User</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Email</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Role</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                  <th className={cn("px-6 py-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Joined</th>
                  <th className={cn("px-6 py-4 font-medium text-right", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {paginatedUsers.map((user: any, idx: number) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        "border-b transition-colors last:border-0",
                        isDark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("border text-[10px]", ROLE_BADGE_COLORS[user.role as Role])}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("border text-[10px]", STATUS_BADGE_COLORS[user.status as UserStatus])}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-slate-400" : "text-slate-500")}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className={cn(isDark && "bg-slate-800 border-slate-700")}>
                            <DropdownMenuItem
                              onClick={() => handleViewProfile(user)}
                              className={cn(isDark && "text-slate-300 focus:bg-slate-700 focus:text-white")}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={cn(
                                user.status === "BANNED"
                                  ? "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                                  : "text-red-600 focus:bg-red-50 focus:text-red-700"
                              )}
                              onClick={() => handleBanToggle(user.id, user.status)}
                            >
                              {user.status === "BANNED" ? (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Unban User
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Ban User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className={cn(isDark && "text-slate-300 focus:bg-slate-700 focus:text-white")}>
                              <Bell className="mr-2 h-4 w-4" />
                              Send Notification
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className={cn(
              "flex items-center justify-between border-t px-6 py-4",
              isDark ? "border-slate-700" : "border-slate-200"
            )}
          >
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(isDark && "border-slate-700 text-slate-300")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    page === currentPage && "bg-primary-600 text-white hover:bg-primary-700",
                    isDark && page !== currentPage && "border-slate-700 text-slate-300"
                  )}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(isDark && "border-slate-700 text-slate-300")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={cn("sm:max-w-lg", isDark && "bg-slate-800 border-slate-700")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>User Profile</DialogTitle>
            <DialogDescription>
              Detailed information about this user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xl font-bold text-white">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div>
                  <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedUser.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("border text-[10px]", ROLE_BADGE_COLORS[selectedUser.role as Role])}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={cn("border text-[10px]", STATUS_BADGE_COLORS[selectedUser.status as UserStatus])}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <Mail className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Email</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Phone</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {selectedUser.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Location</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {selectedUser.location || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Joined</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className={cn(isDark && "border-slate-700 text-slate-300")}
                >
                  Close
                </Button>
                {selectedUser.status === "BANNED" ? (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleBanToggle(selectedUser.id, selectedUser.status)}
                    disabled={banUser.isPending}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Unban User
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleBanToggle(selectedUser.id, selectedUser.status)}
                    disabled={banUser.isPending}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
