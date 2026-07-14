import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  Star,
  Search,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useServices, useCategories } from "@/hooks/useApi";
import { technicians } from "@/mock/data";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/components/shared/ServiceCard";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SearchBar from "@/components/shared/SearchBar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type SortOption = "price-asc" | "price-desc" | "rating" | "popular" | "newest";

interface Filters {
  search: string;
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  sort: SortOption;
}

const PRICE_MIN = 0;
const PRICE_MAX = 1500;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const RATING_OPTIONS = [4, 3, 2, 1];

export default function Services() {
  const { isDark } = useThemeContext();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
    priceRange: [PRICE_MIN, PRICE_MAX],
    minRating: 0,
    sort: "popular",
  });

  const servicesData = useServices({
    search: filters.search || undefined,
    categoryId: filters.categories.length === 1 ? filters.categories[0] : undefined,
  });
  const categoriesData = useCategories();
  const isLoading = servicesData.isLoading || categoriesData.isLoading;
  const apiServices = servicesData.data?.data || [];
  const apiCategories = categoriesData.data?.data || [];

  const enrichedServices = useMemo(() => {
    return apiServices.map((s: any) => ({
      ...s,
      technician: technicians.find((t) => t.id === s.technicianId),
      category: apiCategories.find((c: any) => c.id === s.categoryId),
    }));
  }, [apiServices, apiCategories]);

  const toggleCategory = (catSlug: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(catSlug)
        ? prev.categories.filter((c) => c !== catSlug)
        : [...prev.categories, catSlug],
    }));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      priceRange: [PRICE_MIN, PRICE_MAX],
      minRating: 0,
      sort: "popular",
    });
  };

  const filteredServices = useMemo(() => {
    let result = [...enrichedServices];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((s) => s.category && filters.categories.includes(s.category.slug));
    }

    result = result.filter(
      (s) => s.price >= filters.priceRange[0] && s.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      result = result.filter((s) => s.rating >= filters.minRating);
    }

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return result;
  }, [filters]);

  const FilterSidebar = ({ className }: { className?: string }) => (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className={cn("mb-3 text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
          Sort By
        </h3>
        <Select
          value={filters.sort}
          onValueChange={(v) => setFilters((prev) => ({ ...prev, sort: v as SortOption }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className={cn("mb-3 text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
          Categories
        </h3>
        <div className="space-y-3">
          {apiCategories.map((cat: any) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                checked={filters.categories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <label
                className={cn(
                  "flex-1 cursor-pointer text-sm",
                  isDark ? "text-slate-300" : "text-slate-600"
                )}
                onClick={() => toggleCategory(cat.slug)}
              >
                {cat.name}
              </label>
              <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                {cat.serviceCount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between">
          <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
            Price Range
          </h3>
          <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <div className="mt-4 px-1">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
            }
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={25}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>${PRICE_MIN}</span>
          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>${PRICE_MAX}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className={cn("mb-3 text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === rating ? 0 : rating,
                }))
              }
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                filters.minRating === rating
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-700/50"
                    : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                    )}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full !rounded-xl">
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-900" : "bg-slate-50")}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Services"
          subtitle="Browse and book professional home services"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
          ]}
        />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar
              placeholder="Search services..."
              value={filters.search}
              onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "relative shrink-0 sm:hidden",
              filtersOpen && "!bg-primary-50 !text-primary-700 !border-primary-200"
            )}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 sm:block">
            <div
              className={cn(
                "sticky top-24 rounded-2xl border p-5",
                isDark ? "border-slate-700/50 bg-slate-800" : "border-slate-200 bg-white"
              )}
            >
              <FilterSidebar />
            </div>
          </aside>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 sm:hidden"
              >
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className={cn(
                    "fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto border-r p-6 shadow-xl",
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                      Filters
                    </h2>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
                      )}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <FilterSidebar />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <p className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                Showing{" "}
                <span className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {filteredServices.length}
                </span>{" "}
                {filteredServices.length === 1 ? "service" : "services"}
              </p>

              {filters.categories.map((catSlug) => {
                const cat = apiCategories.find((c: any) => c.slug === catSlug);
                return (
                  <Badge
                    key={catSlug}
                    variant="default"
                    className="cursor-pointer transition-colors hover:bg-primary-200"
                    onClick={() => toggleCategory(catSlug)}
                  >
                    {cat?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                );
              })}
              {filters.minRating > 0 && (
                <Badge
                  variant="default"
                  className="cursor-pointer transition-colors hover:bg-primary-200"
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: 0 }))}
                >
                  {filters.minRating}+ Stars
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {(filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) && (
                <Badge
                  variant="default"
                  className="cursor-pointer transition-colors hover:bg-primary-200"
                  onClick={() => setFilters((prev) => ({ ...prev, priceRange: [PRICE_MIN, PRICE_MAX] }))}
                >
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="rounded-2xl border p-0 overflow-hidden border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No services found"
                description="Try adjusting your filters or search terms to find what you're looking for."
                action={{ label: "Clear Filters", href: "#" }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
