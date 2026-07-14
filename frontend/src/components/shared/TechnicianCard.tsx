import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Clock, Award, MapPin } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import StarRating from "@/components/shared/StarRating";
import type { TechnicianProfile } from "@/types";

interface TechnicianCardProps {
  technician: TechnicianProfile;
}

export default function TechnicianCard({ technician }: TechnicianCardProps) {
  const { isDark } = useThemeContext();
  const { user } = technician;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group overflow-hidden rounded-2xl border p-6 text-center transition-shadow duration-300 hover:shadow-xl",
        isDark
          ? "border-slate-700/50 bg-slate-800"
          : "border-slate-200 bg-white"
      )}
    >
      {/* Avatar */}
      <div className="relative mx-auto h-20 w-20">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/40"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-2xl font-bold text-white ring-4 ring-primary-100 dark:ring-primary-900/40">
            {getInitials(user.name)}
          </div>
        )}
        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary-500 dark:border-slate-800">
          <Award className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Name & Category */}
      <h3 className={cn("mt-4 text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
        {user.name}
      </h3>
      <p className="mt-1 text-sm text-primary-600 font-medium">
        {technician.skills[0] || "General Technician"}
      </p>

      {/* Rating */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <StarRating rating={technician.rating} size="sm" />
        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
          {technician.rating.toFixed(1)}
        </span>
        <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
          ({technician.totalReviews} reviews)
        </span>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {technician.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              isDark
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className={cn("mt-5 grid grid-cols-3 gap-3 border-t pt-5", isDark ? "border-slate-700/50" : "border-slate-100")}>
        <div>
          <div className="flex items-center justify-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-primary-500" />
            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
              {technician.completedJobs}
            </span>
          </div>
          <p className={cn("mt-0.5 text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Jobs Done</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary-500" />
            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
              {technician.experienceYears}+
            </span>
          </div>
          <p className={cn("mt-0.5 text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Years Exp</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1">
            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
              {formatCurrency(technician.baseHourlyRate || 0)}
            </span>
          </div>
          <p className={cn("mt-0.5 text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Per Hour</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-2">
        <Link
          to={`/technicians/${user.id}`}
          className={cn(
            "flex-1 rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors",
            isDark
              ? "border-slate-600 text-slate-300 hover:bg-slate-700"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          )}
        >
          View Profile
        </Link>
        <Link to={`/services/${technician.id}`} className="btn-primary flex-1 !rounded-xl !py-2.5 !text-sm">
          Book Now
        </Link>
      </div>
    </motion.div>
  );
}
