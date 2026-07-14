import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  ShieldCheck,
  ShieldOff,
  Star,
  Briefcase,
  Clock,
  Award,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StarRating from "@/components/shared/StarRating";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { useAdminUsers } from "@/hooks/useApi";

export default function AdminTechnicians() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [selectedTech, setSelectedTech] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: usersResp, isLoading } = useAdminUsers();

  const technicians = useMemo(() => {
    const allUsers = usersResp?.data ?? [];
    return allUsers.filter((u: any) => u.role === "TECHNICIAN");
  }, [usersResp]);

  const filteredTechnicians = useMemo(() => {
    let result = [...technicians];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t: any) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((t: any) =>
        (t.skills || []).some((s: string) => s.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
    }

    switch (sortBy) {
      case "name":
        result.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [technicians, searchQuery, categoryFilter, sortBy]);

  const handleViewProfile = (tech: any) => {
    setSelectedTech(tech);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={cn("h-64 rounded-xl animate-pulse", isDark ? "bg-slate-700" : "bg-slate-200")} />
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
          Manage Technicians
        </h1>
        <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          Verify, manage, and monitor all technicians on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10",
              isDark && "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            )}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className={cn("w-full sm:w-48", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="pipe">Plumbing</SelectItem>
            <SelectItem value="wiring">Electrical</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="painting">Painting</SelectItem>
            <SelectItem value="hvac">HVAC</SelectItem>
            <SelectItem value="cabinet">Carpentry</SelectItem>
            <SelectItem value="lawn">Landscaping</SelectItem>
            <SelectItem value="pest">Pest Control</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className={cn("w-full sm:w-44", isDark && "bg-slate-800 border-slate-700 text-white")}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Technician Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredTechnicians.map((tech: any, idx: number) => (
            <motion.div
              key={tech.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={cn(
                  "border transition-shadow hover:shadow-lg",
                  isDark ? "border-slate-700/50 bg-slate-800/80" : "border-slate-200 bg-white"
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {tech.avatar ? (
                      <img
                        src={tech.avatar}
                        alt={tech.name}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900/40"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-lg font-bold text-white ring-2 ring-primary-100 dark:ring-primary-900/40">
                        {getInitials(tech.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={cn("text-base font-bold truncate", isDark ? "text-white" : "text-slate-900")}>
                          {tech.name}
                        </h3>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">
                          Verified
                        </Badge>
                      </div>
                      <p className={cn("text-xs mt-0.5 truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                        {tech.email}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={4.5} size="sm" />
                        <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                          4.5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(tech.skills || []).slice(0, 4).map((skill: string) => (
                      <span
                        key={skill}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className={cn("mt-4 grid grid-cols-3 gap-3 border-t pt-4", isDark ? "border-slate-700/50" : "border-slate-100")}>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Briefcase className="h-3 w-3 text-primary-500" />
                        <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                          {tech.completedJobs || 0}
                        </span>
                      </div>
                      <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Jobs</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3 text-primary-500" />
                        <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                          {tech.experienceYears || 0}+
                        </span>
                      </div>
                      <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Years</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-3 w-3 text-primary-500" />
                        <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                          {tech.baseHourlyRate || 0}
                        </span>
                      </div>
                      <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Per Hour</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewProfile(tech)}
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                    >
                      <ShieldOff className="mr-1 h-3.5 w-3.5" />
                      Suspend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTechnicians.length === 0 && (
        <div className={cn("py-12 text-center", isDark ? "text-slate-500" : "text-slate-400")}>
          <Search className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p className="text-lg font-medium">No technicians found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Technician Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={cn("sm:max-w-2xl max-h-[85vh] overflow-y-auto", isDark && "bg-slate-800 border-slate-700")}>
          <DialogHeader>
            <DialogTitle className={cn(isDark && "text-white")}>Technician Profile</DialogTitle>
            <DialogDescription>Complete profile and performance details</DialogDescription>
          </DialogHeader>

          {selectedTech && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                {selectedTech.avatar ? (
                  <img
                    src={selectedTech.avatar}
                    alt={selectedTech.name}
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/40"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-2xl font-bold text-white">
                    {getInitials(selectedTech.name)}
                  </div>
                )}
                <div>
                  <h3 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedTech.name}
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {selectedTech.bio?.substring(0, 100) || "No bio available"}...
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={4.5} size="sm" />
                    <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      4.5 reviews
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Email</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{selectedTech.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Phone</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{selectedTech.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Location</p>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>{selectedTech.location || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Hourly Rate</p>
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{formatCurrency(selectedTech.baseHourlyRate || 0)}/hr</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Completed Jobs", value: selectedTech.completedJobs || 0, icon: Briefcase },
                  { label: "Experience", value: `${selectedTech.experienceYears || 0}+ years`, icon: Clock },
                  { label: "Total Earnings", value: formatCurrency((selectedTech.completedJobs || 0) * (selectedTech.baseHourlyRate || 50)), icon: DollarSign },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-xl p-3 text-center",
                      isDark ? "bg-slate-700/50" : "bg-slate-50"
                    )}
                  >
                    <stat.icon className={cn("mx-auto h-5 w-5 mb-1", isDark ? "text-primary-400" : "text-primary-600")} />
                    <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>{stat.value}</p>
                    <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <p className={cn("text-sm font-semibold mb-2", isDark ? "text-white" : "text-slate-900")}>Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedTech.skills || []).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className={cn(isDark && "border-slate-700 text-slate-300")}
                >
                  Close
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify Technician
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
