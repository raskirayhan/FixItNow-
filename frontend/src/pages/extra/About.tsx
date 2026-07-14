import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Wrench,
  Calendar,
  Award,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Every technician is background-checked and verified for your peace of mind.",
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Book same-day services and get connected with professionals in minutes.",
  },
  {
    icon: Heart,
    title: "Quality",
    description: "We maintain the highest standards with continuous quality monitoring.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building stronger neighborhoods through reliable home services.",
  },
];

const team = [
  { name: "Alex Morgan", role: "CEO & Co-founder", initials: "AM" },
  { name: "Jordan Lee", role: "CTO & Co-founder", initials: "JL" },
  { name: "Sam Patel", role: "Head of Operations", initials: "SP" },
  { name: "Casey Kim", role: "Head of Design", initials: "CK" },
];

const timeline = [
  { year: "2024", title: "Founded", description: "FixItNow was born from a simple idea: home services should be easy." },
  { year: "2024", title: "First 100 Technicians", description: "Onboarded our first 100 verified technicians across New York City." },
  { year: "2025", title: "Series A Funding", description: "Raised $5M to expand our platform and reach more cities." },
  { year: "2026", title: "National Expansion", description: "Now serving 15+ cities with plans to cover all major US metros." },
];

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Verified Technicians" },
  { value: "20,000+", label: "Jobs Completed" },
  { value: "4.9/5", label: "Average Rating" },
];

export default function About() {
  const { isDark } = useThemeContext();

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-white")}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-primary-600/5" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className={cn(isDark ? "text-white" : "text-slate-900")}>About </span>
              <span className="text-gradient">FixItNow</span>
            </h1>
            <p
              className={cn(
                "mx-auto mt-6 max-w-2xl text-lg",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              We&apos;re on a mission to make home maintenance effortless, connecting homeowners
              with trusted professionals at the tap of a button.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className={cn("px-4 py-20 sm:px-6 lg:px-8", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-12 lg:grid-cols-2 lg:items-center"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                  Our Mission
                </span>
              </div>
              <h2
                className={cn(
                  "text-3xl font-bold tracking-tight sm:text-4xl",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Making home maintenance{" "}
                <span className="text-gradient">effortless</span>
              </h2>
              <p className={cn("text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
                We believe everyone deserves access to reliable, affordable home services.
                FixItNow eliminates the hassle of finding trustworthy technicians by connecting
                you directly with vetted, top-rated professionals in your area.
              </p>
              <p className={cn("text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
                From emergency repairs to scheduled maintenance, we&apos;re here to keep your home
                running smoothly so you can focus on what matters most.
              </p>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={cn(
                      "rounded-2xl border p-6 text-center",
                      isDark
                        ? "border-slate-700 bg-slate-800"
                        : "border-slate-200 bg-white shadow-sm"
                    )}
                  >
                    <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                    <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story / Timeline */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight sm:text-4xl",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Our Story
            </h2>
            <p className={cn("mt-4 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              From a simple idea to a growing platform trusted by thousands.
            </p>
          </motion.div>

          <div className="relative mt-16">
            <div className="absolute left-4 top-0 h-full w-px bg-primary-200 sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year + item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    "relative flex items-start gap-8",
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  )}
                >
                  <div className="hidden sm:block sm:w-1/2" />
                  <div className="absolute left-4 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-primary-600 bg-white sm:left-1/2" />
                  <div
                    className={cn(
                      "ml-12 flex-1 rounded-2xl border p-6 sm:ml-0",
                      isDark
                        ? "border-slate-700 bg-slate-800"
                        : "border-slate-200 bg-white shadow-sm"
                    )}
                  >
                    <Badge variant="default" className="mb-2">
                      {item.year}
                    </Badge>
                    <h3
                      className={cn(
                        "text-lg font-bold",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={cn("px-4 py-20 sm:px-6 lg:px-8", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight sm:text-4xl",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Meet Our Team
            </h2>
            <p className={cn("mt-4 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              The passionate people behind FixItNow.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
                      {member.initials}
                    </div>
                    <h3
                      className={cn(
                        "mt-4 text-lg font-bold",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary-600">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight sm:text-4xl",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                      <value.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3
                      className={cn(
                        "mt-4 text-lg font-bold",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {value.title}
                    </h3>
                    <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            Join thousands of satisfied customers who trust FixItNow for their home service needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Browse Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
