import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency, truncate } from "@/lib/utils";
import StarRating from "@/components/shared/StarRating";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { isDark } = useThemeContext();
  const [favorited, setFavorited] = useState(service.isFavorite ?? false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-shadow duration-300 hover:shadow-xl",
        isDark
          ? "border-slate-700/50 bg-slate-800"
          : "border-slate-200 bg-white"
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
            <span className="text-4xl">🔧</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        {service.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
            {service.category.name}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setFavorited(!favorited)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 dark:bg-slate-900/90"
        >
          <motion.div
            animate={favorited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                favorited ? "fill-red-500 text-red-500" : "text-slate-400"
              )}
            />
          </motion.div>
        </button>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
            {formatCurrency(service.price)}
            <span className="font-normal opacity-80">/hr</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={cn("text-base font-bold leading-tight", isDark ? "text-white" : "text-slate-900")}>
          {service.title}
        </h3>
        <p className={cn("mt-1.5 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
          {truncate(service.description || "", 80)}
        </p>

        {/* Technician Info */}
        {service.technician && (() => {
          const tech = service.technician as any;
          const techName = tech.name || tech.user?.name || "Technician";
          const techAvatar = tech.avatar || tech.user?.avatar;
          return (
            <div className="mt-4 flex items-center gap-3 border-t pt-4 dark:border-slate-700/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold">
                {techAvatar ? (
                  <img
                    src={techAvatar}
                    alt={techName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  techName.charAt(0)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  {techName}
                </p>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={service.rating} size="sm" />
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                    ({service.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Book Button */}
        <Link
          to={`/booking/${service.id}`}
          className="btn-primary mt-4 w-full !rounded-xl !py-2.5 !text-sm"
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  );
}
