import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Share2,
  Heart,
  Clock,
  Briefcase,
  Star,
  Zap,
  ShieldCheck,
  Award,
  CalendarDays,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  BookOpen,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency } from "@/lib/utils";
import { useTechnicianServices, useTechnicianReviews } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import type { TechnicianProfile as TechnicianProfileType, Service, Review } from "@/types";
import type { TechnicianProfile } from "@/types";
import ServiceCard from "@/components/shared/ServiceCard";
import { technicians } from "@/mock/data";
import ReviewCard from "@/components/shared/ReviewCard";
import StarRating from "@/components/shared/StarRating";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function TechnicianProfile() {
  const { technicianId } = useParams<{ technicianId: string }>();
  const navigate = useNavigate();
  const { isDark } = useThemeContext();
  const [isFavorited, setIsFavorited] = useState(false);

  const servicesData = useTechnicianServices(technicianId || "");
  const reviewsData = useTechnicianReviews(technicianId || "");
  const isLoadingServices = servicesData.isLoading;
  const isLoadingReviews = reviewsData.isLoading;
  const isLoading = isLoadingServices || isLoadingReviews;
  const apiServices = servicesData.data?.data || [];
  const apiReviews = reviewsData.data?.data || [];

  const technician: TechnicianProfileType | null = useMemo(() => {
    if (apiServices.length > 0 && apiServices[0].technician) {
      const tech = apiServices[0].technician;
      return {
        id: tech.id,
        userId: tech.id,
        user: {
          id: tech.id,
          name: tech.name,
          email: tech.email,
          phone: tech.phone || "",
          location: tech.location || "",
          avatar: tech.avatar || `https://i.pravatar.cc/150?u=${tech.id}`,
          role: "TECHNICIAN",
          status: "ACTIVE",
          createdAt: tech.createdAt || new Date().toISOString(),
        },
        bio: tech.technicianProfile?.bio || "Professional home service technician.",
        experienceYears: tech.technicianProfile?.experienceYears || 5,
        skills: tech.technicianProfile?.skills || ["General Maintenance"],
        baseHourlyRate: tech.technicianProfile?.baseHourlyRate || 50,
        rating: 4.8,
        totalReviews: apiReviews.length,
        completedJobs: 15,
        availability: [
          { day: "Monday", available: true, startTime: "08:00", endTime: "18:00" },
          { day: "Tuesday", available: true, startTime: "08:00", endTime: "18:00" },
          { day: "Wednesday", available: true, startTime: "08:00", endTime: "18:00" },
          { day: "Thursday", available: true, startTime: "08:00", endTime: "18:00" },
          { day: "Friday", available: true, startTime: "08:00", endTime: "17:00" },
        ],
      } as any;
    }
    const mockTech = technicians.find(
      (t) => t.id === technicianId || t.userId === technicianId || t.user?.id === technicianId
    );
    return mockTech || null;
  }, [apiServices, apiReviews, technicianId]);

  const techServices: Service[] = useMemo(() => {
    if (!technician) return [];
    return apiServices.map((s: any) => ({
      ...s,
      technician,
      category: undefined,
    }));
  }, [apiServices, technician]);

  const techReviews: Review[] = useMemo(() => {
    if (!technician) return [];
    return apiReviews.map((r: any) => ({
      ...r,
      customer: r.customer || undefined,
    }));
  }, [apiReviews, technician]);

  if (isLoading) {
    return (
      <div className={cn("min-h-screen", isDark ? "bg-slate-900" : "bg-slate-50")}>
        <div className={cn(
          "relative overflow-hidden",
          isDark
            ? "bg-gradient-to-r from-slate-800 via-slate-900 to-primary-950/30"
            : "bg-gradient-to-r from-slate-100 via-white to-primary-50"
        )}>
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <Skeleton className="h-28 w-28 rounded-3xl sm:h-32 sm:w-32" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-8 h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-slate-900" : "bg-slate-50")}>
        <div className="text-center">
          <p className={cn("text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
            Technician not found.
          </p>
          <Button onClick={() => navigate("/services")} className="mt-4">
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  const { user, availability } = technician;
  const primarySkill = technician.skills[0] || "General Technician";
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-900" : "bg-slate-50")}>
      {/* Profile Header */}
      <div className={cn(
        "relative overflow-hidden",
        isDark
          ? "bg-gradient-to-r from-slate-800 via-slate-900 to-primary-950/30"
          : "bg-gradient-to-r from-slate-100 via-white to-primary-50"
      )}>
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-primary-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 sm:flex-row"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-28 w-28 rounded-3xl object-cover ring-4 ring-white shadow-xl sm:h-32 sm:w-32 dark:ring-slate-800"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 text-4xl font-bold text-white ring-4 ring-white shadow-xl sm:h-32 sm:w-32 dark:ring-slate-800">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow dark:border-slate-800">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h1 className={cn("text-2xl font-extrabold sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                      {user.name}
                    </h1>
                    <Badge variant="success" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary-600">{primarySkill}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="!rounded-xl"
                  >
                    <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
                    {isFavorited ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" className="!rounded-xl">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
                <span className={cn("flex items-center gap-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  <MapPin className="h-4 w-4" />
                  {user.location || "Location not set"}
                </span>
                <span className="flex items-center gap-1.5">
                  <StarRating rating={technician.rating} size="sm" />
                  <span className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {technician.rating.toFixed(1)}
                  </span>
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    ({technician.totalReviews} reviews)
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Row */}
            <motion.div
              {...staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { icon: Briefcase, label: "Completed Jobs", value: technician.completedJobs.toLocaleString() },
                { icon: Star, label: "Rating", value: technician.rating.toFixed(1) },
                { icon: Clock, label: "Experience", value: `${technician.experienceYears}+ years` },
                { icon: Zap, label: "Response Time", value: "< 1 hour" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  {...staggerItem}
                  className={cn(
                    "rounded-xl border p-4 text-center",
                    isDark ? "border-slate-700/50 bg-slate-800" : "border-slate-200 bg-white"
                  )}
                >
                  <stat.icon className="mx-auto h-5 w-5 text-primary-500" />
                  <p className={cn("mt-2 text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {stat.value}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs Section */}
            <div className="mt-8">
              <Tabs defaultValue="about">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Bio */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                          {technician.bio || "No bio available."}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {technician.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Certificates */}
                    {technician.certificates && technician.certificates.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Certificates & Licenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {technician.certificates.map((cert) => (
                              <div key={cert} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                                  <Award className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <span className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                                  {cert}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {techServices.length === 0 ? (
                      <div className={cn(
                        "rounded-2xl border border-dashed p-12 text-center",
                        isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-300 bg-slate-50"
                      )}>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                          No services listed yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {techServices.map((service) => (
                          <ServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Rating Summary */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className={cn("text-4xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                              {technician.rating.toFixed(1)}
                            </p>
                            <StarRating rating={technician.rating} size="md" />
                            <p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              {technician.totalReviews} reviews
                            </p>
                          </div>
                          <Separator orientation="vertical" className="h-16" />
                          <div className="flex-1 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const pct = star === 5 ? 72 : star === 4 ? 22 : star === 3 ? 4 : star === 2 ? 1 : 1;
                              return (
                                <div key={star} className="flex items-center gap-2">
                                  <span className={cn("w-3 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                    {star}
                                  </span>
                                  <div className={cn("h-2 flex-1 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-200")}>
                                    <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className={cn("w-8 text-right text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                    {pct}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Reviews List */}
                    {techReviews.length === 0 ? (
                      <div className={cn(
                        "rounded-2xl border border-dashed p-12 text-center",
                        isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-300 bg-slate-50"
                      )}>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                          No reviews yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {techReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Availability Tab */}
                <TabsContent value="availability" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CalendarDays className="h-5 w-5 text-primary-500" />
                          Weekly Availability
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                          {(availability || []).map((day) => (
                            <div
                              key={day.day}
                              className={cn(
                                "rounded-xl border p-4 text-center transition-colors",
                                day.available
                                  ? isDark
                                    ? "border-green-800/50 bg-green-900/10"
                                    : "border-green-200 bg-green-50"
                                  : isDark
                                    ? "border-slate-700/50 bg-slate-800/50 opacity-60"
                                    : "border-slate-200 bg-slate-50 opacity-60"
                              )}
                            >
                              <p className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                                {day.day.slice(0, 3)}
                              </p>
                              {day.available ? (
                                <>
                                  <CheckCircle2 className="mx-auto mt-2 h-5 w-5 text-green-500" />
                                  <p className={cn("mt-1 text-xs font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                                    {day.startTime} - {day.endTime}
                                  </p>
                                </>
                              ) : (
                                <p className={cn("mt-3 text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                                  Unavailable
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <motion.div {...fadeInUp}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        Starting from
                      </p>
                      <p className={cn("mt-1 text-3xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
                        {formatCurrency(technician.baseHourlyRate || 0)}
                        <span className="text-sm font-normal text-slate-500">/hr</span>
                      </p>
                    </div>

                    <Button
                      className="mt-6 w-full !rounded-xl !py-6 text-base"
                      onClick={() => {
                        const firstService = techServices[0];
                        if (firstService) {
                          navigate(`/booking/${firstService.id}`);
                        }
                      }}
                    >
                      Book Appointment
                    </Button>

                    <Separator className="my-5" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", isDark ? "bg-slate-700" : "bg-slate-100")}>
                          <Clock className="h-4 w-4 text-primary-500" />
                        </div>
                        <div>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Response Time</p>
                          <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>Under 1 hour</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", isDark ? "bg-slate-700" : "bg-slate-100")}>
                          <Briefcase className="h-4 w-4 text-primary-500" />
                        </div>
                        <div>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Completed Jobs</p>
                          <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{technician.completedJobs}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", isDark ? "bg-slate-700" : "bg-slate-100")}>
                          <Award className="h-4 w-4 text-primary-500" />
                        </div>
                        <div>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Member Since</p>
                          <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>{memberSince}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Card */}
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <a
                        href={`tel:${user.phone}`}
                        className={cn(
                          "flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors",
                          isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <Phone className="h-4 w-4 text-primary-500" />
                        {user.phone || "Phone not available"}
                      </a>
                      <a
                        href={`mailto:${user.email}`}
                        className={cn(
                          "flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors",
                          isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <Mail className="h-4 w-4 text-primary-500" />
                        {user.email}
                      </a>
                      <button
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors",
                          isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <MessageCircle className="h-4 w-4 text-primary-500" />
                        Send a Message
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
