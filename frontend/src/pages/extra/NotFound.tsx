import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Home, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function NotFound() {
  const { isDark } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center px-4",
        isDark ? "bg-slate-950" : "bg-white"
      )}
    >
      {/* Floating Elements */}
      <FloatingShape
        className="absolute top-1/4 left-1/4 h-20 w-20 rounded-full bg-primary-500/10 blur-2xl"
        delay={0}
      />
      <FloatingShape
        className="absolute bottom-1/3 right-1/4 h-32 w-32 rounded-full bg-primary-500/5 blur-3xl"
        delay={2}
      />
      <FloatingShape
        className="absolute top-1/3 right-1/3 h-16 w-16 rounded-2xl bg-primary-500/10 blur-xl"
        delay={4}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <h1 className="text-[10rem] font-bold leading-none text-gradient sm:text-[12rem]">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
            <MapPin className="h-10 w-10 text-primary-600" />
          </div>
          <h2
            className={cn(
              "mt-6 text-3xl font-bold tracking-tight",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Page Not Found
          </h2>
          <p
            className={cn(
              "mx-auto mt-4 max-w-md text-lg",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-8 max-w-md"
        >
          <div className="relative">
            <Input
              placeholder="Search for a page..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link to="/">
            <Button size="lg">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
