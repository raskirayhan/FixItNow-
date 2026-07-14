import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, MessageSquare, Camera, Briefcase, Send } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const PLATFORM_LINKS = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/help" },
  { label: "Safety", href: "/safety" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const SERVICE_CATEGORIES = [
  { label: "Plumbing", href: "/services?category=plumbing" },
  { label: "Electrical", href: "/services?category=electrical" },
  { label: "Cleaning", href: "/services?category=cleaning" },
  { label: "Painting", href: "/services?category=painting" },
  { label: "Carpentry", href: "/services?category=carpentry" },
];

const SOCIAL_LINKS = [
  { icon: Globe, href: "#", label: "Facebook" },
  { icon: MessageSquare, href: "#", label: "Twitter" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const { isDark } = useThemeContext();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer
      className={cn(
        "border-t",
        isDark
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xs shadow-sm">
                FN
              </div>
              <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                Fix<span className="text-primary-600">It</span>Now
              </span>
            </Link>
            <p className={cn("mt-4 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
              Your trusted marketplace for professional home services.
              Book verified technicians for any job, big or small.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isDark
                      ? "bg-slate-800 text-slate-400 hover:bg-primary-600 hover:text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-primary-600 hover:text-white"
                  )}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider", isDark ? "text-white" : "text-slate-900")}>
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={cn(
                      "text-sm transition-colors hover:text-primary-600",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider", isDark ? "text-white" : "text-slate-900")}>
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={cn(
                      "text-sm transition-colors hover:text-primary-600",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Newsletter Column */}
          <div>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider", isDark ? "text-white" : "text-slate-900")}>
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.href}
                    className={cn(
                      "text-sm transition-colors hover:text-primary-600",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className={cn("mt-8 text-sm font-semibold uppercase tracking-wider", isDark ? "text-white" : "text-slate-900")}>
              Newsletter
            </h3>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
                    : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400"
                )}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-primary-600 px-3 py-2 text-white transition-colors hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-xs text-primary-600 font-medium">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn("mt-12 border-t pt-8 text-center", isDark ? "border-slate-800" : "border-slate-100")}>
          <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
            &copy; {new Date().getFullYear()} FixItNow. All rights reserved. Made with{" "}
            <span className="text-red-500">&hearts;</span> for better home services.
          </p>
        </div>
      </div>
    </footer>
  );
}
