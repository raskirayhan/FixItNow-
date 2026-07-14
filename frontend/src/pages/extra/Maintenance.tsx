import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Mail, ArrowRight, Globe, MessageSquare, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function Maintenance() {
  const { isDark } = useThemeContext();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center px-4",
        isDark ? "bg-slate-950" : "bg-white"
      )}
    >
      {/* Background Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-40 w-40 rounded-full bg-primary-500/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 h-60 w-60 rounded-full bg-primary-500/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-lg text-center"
      >
        {/* Animated Wrench Icon */}
        <motion.div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-100"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        >
          <Wrench className="h-12 w-12 text-primary-600" />
        </motion.div>

        <h1
          className={cn(
            "mt-8 text-4xl font-bold tracking-tight",
            isDark ? "text-white" : "text-slate-900"
          )}
        >
          Under Maintenance
        </h1>
        <p
          className={cn(
            "mt-4 text-lg",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          We&apos;re working on improving your experience.
          <br />
          We&apos;ll be back soon!
        </p>

        {/* Expected Time */}
        <div
          className={cn(
            "mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2",
            isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
          </span>
          <span className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
            Expected completion: Today by 6:00 PM EST
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs">
            <span className={cn(isDark ? "text-slate-400" : "text-slate-500")}>
              Progress
            </span>
            <span className="text-primary-600 font-medium">75%</span>
          </div>
          <Progress value={75} className="mt-2 h-3" />
        </div>

        {/* Email Signup */}
        <div className="mt-10">
          {!isSubmitted ? (
            <div>
              <p className={cn("mb-4 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Get notified when we&apos;re back online
              </p>
              <form onSubmit={handleNotify} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    icon={<Mail className="h-4 w-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">
                  Notify Me
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  You&apos;ll be notified when we&apos;re back!
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-10">
          <p className={cn("mb-3 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
            Follow us for updates
          </p>
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: MessageSquare, label: "Twitter" },
              { icon: Globe, label: "GitHub" },
              { icon: Briefcase, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                  isDark
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
