import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ChevronRight,
  Shield,
  CreditCard,
  Headphones,
  ThumbsUp,
  SearchCheck,
  CalendarCheck,
  Wrench,
  ArrowRight,
  Star,
  Users,
  Briefcase,
  BadgeCheck,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { technicians, reviews, faqs, stats, users } from "@/mock/data";
import { useServices, useCategories } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service, Category } from "@/types";
import ServiceCard from "@/components/shared/ServiceCard";
import TechnicianCard from "@/components/shared/TechnicianCard";
import ReviewCard from "@/components/shared/ReviewCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const heroStats = [
  { icon: Users, label: "Happy Customers", value: stats.customers },
  { icon: Briefcase, label: "Jobs Completed", value: stats.jobs },
  { icon: Star, label: "Average Rating", value: stats.rating },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description:
      "Every technician undergoes rigorous background checks, license verification, and skill assessments before joining our platform.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay with confidence using our encrypted payment system. Your financial data is always protected and transactions are secure.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to help you with any questions or concerns about your service.",
    color: "bg-violet-500",
    lightColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    icon: ThumbsUp,
    title: "Satisfaction Guarantee",
    description:
      "Not happy? We'll make it right. Our satisfaction guarantee ensures you get the quality service you deserve every time.",
    color: "bg-amber-500",
    lightColor: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const howItWorks = [
  {
    icon: SearchCheck,
    title: "Choose Service",
    description:
      "Browse our wide selection of home services. Read reviews, compare prices, and find the perfect professional for your needs.",
    step: 1,
  },
  {
    icon: CalendarCheck,
    title: "Book Appointment",
    description:
      "Select your preferred date and time. Our flexible scheduling makes it easy to find a slot that works for you.",
    step: 2,
  },
  {
    icon: Wrench,
    title: "Get It Done",
    description:
      "Sit back and relax while our verified professional takes care of everything. Track progress in real-time.",
    step: 3,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Landing() {
  const { isDark } = useThemeContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const servicesData = useServices();
  const categoriesData = useCategories();
  const servicesLoading = servicesData.isLoading;
  const categoriesLoading = categoriesData.isLoading;
  const apiServices: Service[] = servicesData.data?.data || [];
  const apiCategories: Category[] = categoriesData.data?.data || [];

  const featuredServices = apiServices.slice(0, 6);
  const topTechnicians = technicians.slice(0, 4);
  const featuredReviews = reviews.slice(0, 3);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-gradient-to-br from-slate-900 via-slate-900 to-primary-950/30"
            : "bg-gradient-to-br from-slate-50 via-white to-primary-50/40"
        )} />

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-primary-600/15 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2"
            >
              <Badge variant="default" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-4 py-1.5 text-sm">
                <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                Trusted by 10,000+ customers
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn(
                "text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Find Trusted{" "}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Home Service
              </span>{" "}
              Professionals
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                "mx-auto mt-6 max-w-2xl text-lg leading-relaxed",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              Book verified professionals for plumbing, electrical, cleaning, painting,
              and more. Quality service guaranteed at transparent prices.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-10 max-w-2xl"
            >
              <div className={cn(
                "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border p-3 shadow-xl",
                isDark
                  ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-xl"
                  : "border-slate-200 bg-white/90 backdrop-blur-xl"
              )}>
                <div className="flex items-center gap-2 flex-1 px-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary-500" />
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full bg-transparent text-sm outline-none",
                      isDark
                        ? "text-white placeholder-slate-500"
                        : "text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div className={cn(
                  "h-px w-full sm:h-8 sm:w-px",
                  isDark ? "bg-slate-700" : "bg-slate-200"
                )} />

                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="h-5 w-5 shrink-0 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={cn(
                      "w-full bg-transparent text-sm outline-none cursor-pointer",
                      isDark
                        ? "text-white placeholder-slate-500"
                        : "text-slate-900 placeholder-slate-400"
                    )}
                  >
                    <option value="">All Services</option>
                    {apiCategories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleSearch} className="shrink-0 !rounded-xl !px-6">
                  <Search className="mr-1 h-4 w-4" />
                  Search
                </Button>
              </div>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
            >
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut" as const,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    isDark
                      ? "bg-primary-900/30 text-primary-400"
                      : "bg-primary-100 text-primary-600"
                  )}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {stat.value}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={cn(
        "py-16",
        isDark ? "bg-slate-900/50" : "bg-white"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          >
            {[
              { label: "Happy Customers", value: 10000, suffix: "+", icon: Users },
              { label: "Expert Technicians", value: 500, suffix: "+", icon: Briefcase },
              { label: "Jobs Completed", value: 20000, suffix: "+", icon: BadgeCheck },
              { label: "Average Rating", value: 4.9, suffix: "", icon: Star, decimals: 1 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-6 text-center transition-shadow duration-300 hover:shadow-lg",
                  isDark
                    ? "border-slate-700/50 bg-slate-800/80"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className={cn(
                  "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                  isDark
                    ? "bg-primary-900/30 text-primary-400"
                    : "bg-primary-100 text-primary-600"
                )}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className={cn("mt-1 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                  {stat.label}
                </p>
                <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-primary-500/10 blur-2xl" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className={cn("py-20", isDark ? "bg-slate-900" : "bg-slate-50")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex items-end justify-between">
            <div>
              <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
                Popular Services
              </h2>
              <p className={cn("mt-3 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
                Discover our most booked home services
              </p>
            </div>
            <Link
              to="/services"
              className={cn(
                "hidden items-center gap-1 text-sm font-semibold transition-colors sm:flex",
                "text-primary-600 hover:text-primary-700"
              )}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {servicesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
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
                ))
              : featuredServices.map((service) => (
                  <motion.div key={service.id} {...staggerItem}>
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={cn("py-20", isDark ? "bg-slate-900" : "bg-white")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
              Why Choose FixItNow
            </h2>
            <p className={cn("mx-auto mt-3 max-w-2xl text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              We make home services simple, reliable, and affordable
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {whyChooseUs.map((item) => (
              <motion.div
                key={item.title}
                {...staggerItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg",
                  isDark
                    ? "border-slate-700/50 bg-slate-800"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl",
                  item.lightColor
                )}>
                  <item.icon className={cn("h-7 w-7", item.color.replace("bg-", "text-"))} />
                </div>
                <h3 className={cn("mt-5 text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {item.title}
                </h3>
                <p className={cn("mt-2 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={cn("py-20", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
              How It Works
            </h2>
            <p className={cn("mx-auto mt-3 max-w-2xl text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Get your home services booked in three simple steps
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {/* Connection line - desktop only */}
            <div className="absolute top-14 left-[20%] right-[20%] hidden h-0.5 md:block">
              <div className={cn("h-full", isDark ? "bg-slate-700" : "bg-slate-200")} />
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0 origin-left bg-gradient-to-r from-primary-500 to-primary-400"
              />
            </div>

            {howItWorks.map((step) => (
              <motion.div
                key={step.step}
                {...staggerItem}
                className="relative text-center"
              >
                <div className="relative mx-auto">
                  <div className={cn(
                    "mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-dashed transition-colors",
                    isDark
                      ? "border-primary-800 bg-slate-800"
                      : "border-primary-200 bg-white"
                  )}>
                    <step.icon className={cn("h-12 w-12", "text-primary-600")} />
                  </div>
                  <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className={cn("mt-6 text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {step.title}
                </h3>
                <p className={cn("mt-3 mx-auto max-w-xs text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Technicians Section */}
      <section className={cn("py-20", isDark ? "bg-slate-900" : "bg-white")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex items-end justify-between">
            <div>
              <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
                Top Rated Professionals
              </h2>
              <p className={cn("mt-3 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
                Meet our highest-rated service providers
              </p>
            </div>
            <Link
              to="/technicians"
              className={cn(
                "hidden items-center gap-1 text-sm font-semibold transition-colors sm:flex",
                "text-primary-600 hover:text-primary-700"
              )}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {topTechnicians.map((tech) => (
              <motion.div key={tech.id} {...staggerItem}>
                <TechnicianCard technician={tech} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/technicians"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              View All Professionals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className={cn("py-20", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
              What Our Customers Say
            </h2>
            <p className={cn("mx-auto mt-3 max-w-2xl text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Real reviews from real customers who trust FixItNow
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {featuredReviews.map((review) => {
              const customer = users.find((u) => u.id === review.customerId);
              const reviewWithCustomer = { ...review, customer };
              return (
                <motion.div key={review.id} {...staggerItem}>
                  <ReviewCard review={reviewWithCustomer} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={cn("py-20", isDark ? "bg-slate-900" : "bg-white")}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
              Frequently Asked Questions
            </h2>
            <p className={cn("mx-auto mt-3 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Find answers to common questions about FixItNow
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={cn(
                    "border-b",
                    isDark ? "border-slate-700/50" : "border-slate-200"
                  )}
                >
                  <AccordionTrigger
                    className={cn(
                      "text-left text-base font-semibold py-5",
                      isDark ? "text-white hover:text-primary-400" : "text-slate-900 hover:text-primary-700"
                    )}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className={cn(
                      "text-sm leading-relaxed pb-5",
                      isDark ? "text-slate-400" : "text-slate-600"
                    )}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.07%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Join thousands of satisfied customers who trust FixItNow for their home
              service needs. Your perfect professional is just a click away.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button
                  size="lg"
                  className="!rounded-xl !bg-white !text-primary-700 !shadow-xl hover:!bg-slate-50 !px-8"
                >
                  Get Started Free
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="!rounded-xl !border-white/30 !text-white hover:!bg-white/10 !px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
