import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  TrendingUp,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobOpenings } from "@/mock/data";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatDate } from "@/lib/utils";

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance for you and your family.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Annual learning budget, mentorship programs, and clear career progression paths.",
  },
  {
    icon: Clock,
    title: "Flexibility",
    description: "Flexible work hours, remote-first culture, and generous PTO policy.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Team retreats, social events, and a collaborative, inclusive work environment.",
  },
];

const typeBadgeVariant: Record<string, "default" | "secondary" | "info" | "success" | "warning"> = {
  "full-time": "success",
  "part-time": "info",
  contract: "warning",
};

export default function Careers() {
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className={cn(isDark ? "text-white" : "text-slate-900")}>Join Our </span>
              <span className="text-gradient">Team</span>
            </h1>
            <p
              className={cn(
                "mx-auto mt-6 max-w-2xl text-lg",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              Help us revolutionize how people maintain their homes. We&apos;re building the future of
              home services and we want you on board.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <a href="#positions">
                View Open Positions
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Culture */}
      <section className={cn("px-4 py-20 sm:px-6 lg:px-8", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Sparkles className="mx-auto h-10 w-10 text-primary-600" />
            <h2
              className={cn(
                "mt-4 text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Our Culture
            </h2>
            <p
              className={cn(
                "mx-auto mt-4 max-w-2xl text-lg",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              We believe in moving fast, staying curious, and building products that make a real
              difference in people&apos;s lives. Our team is passionate, diverse, and always learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
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
                "text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Benefits & Perks
            </h2>
            <p className={cn("mt-4 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              We take care of our team so they can take care of our customers.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                      <benefit.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3
                      className={cn(
                        "mt-4 text-lg font-bold",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {benefit.title}
                    </h3>
                    <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section
        id="positions"
        className={cn("px-4 py-20 sm:px-6 lg:px-8", isDark ? "bg-slate-900/50" : "bg-slate-50")}
      >
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
                "text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Open Positions
            </h2>
            <p className={cn("mt-4 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Find a role that matches your skills and passion.
            </p>
          </motion.div>

          <div className="mt-10 space-y-4">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-bold",
                            isDark ? "text-white" : "text-slate-900"
                          )}
                        >
                          {job.title}
                        </h3>
                        <Badge variant={typeBadgeVariant[job.type]}>
                          {job.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
            Don&apos;t see your role?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in
            mind for future openings.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary-700 hover:bg-primary-50"
            >
              Send Your Resume
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
