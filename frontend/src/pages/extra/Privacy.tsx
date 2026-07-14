import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const sections = [
  { id: "collection", title: "Information Collection" },
  { id: "usage", title: "Information Usage" },
  { id: "sharing", title: "Information Sharing" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies" },
  { id: "changes", title: "Changes to Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function Privacy() {
  const { isDark } = useThemeContext();
  const [activeSection, setActiveSection] = useState("collection");

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-950" : "bg-white")}>
      <Navbar />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Shield className="mx-auto h-12 w-12 text-primary-600" />
            <h1 className={cn("mt-4 text-4xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Privacy Policy
            </h1>
            <p className={cn("mt-4 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Last updated: July 1, 2026
            </p>
          </motion.div>

          <div className="mt-16 grid gap-12 lg:grid-cols-4">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={cn(
                        "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        activeSection === section.id
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-10">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="p-8 space-y-6">
                    <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                      At FixItNow, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    </p>

                    <section id="collection">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Information Collection</h2>
                      <div className={cn("text-sm leading-relaxed space-y-3", isDark ? "text-slate-400" : "text-slate-600")}>
                        <p>We collect information that you provide directly to us, including:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Account registration details (name, email, phone number)</li>
                          <li>Payment and billing information</li>
                          <li>Service booking details and addresses</li>
                          <li>Communications with us and with technicians</li>
                          <li>Reviews and feedback you submit</li>
                          <li>Device and usage data when you access our platform</li>
                        </ul>
                      </div>
                    </section>

                    <section id="usage">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Information Usage</h2>
                      <div className={cn("text-sm leading-relaxed space-y-3", isDark ? "text-slate-400" : "text-slate-600")}>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Provide, maintain, and improve our services</li>
                          <li>Process bookings and transactions</li>
                          <li>Send you service-related communications</li>
                          <li>Personalize your experience</li>
                          <li>Detect and prevent fraud or abuse</li>
                          <li>Comply with legal obligations</li>
                        </ul>
                      </div>
                    </section>

                    <section id="sharing">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Information Sharing</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        We do not sell your personal information. We may share your information with: service providers who assist in operating our platform, technicians involved in your bookings, law enforcement when required by law, and with your explicit consent.
                      </p>
                    </section>

                    <section id="security">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Data Security</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        We implement industry-standard security measures including encryption, firewalls, and secure server infrastructure. While no method of transmission is 100% secure, we take every reasonable precaution to protect your data.
                      </p>
                    </section>

                    <section id="rights">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Your Rights</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time. Contact us to exercise any of these rights.
                      </p>
                    </section>

                    <section id="cookies">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Cookies</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
                      </p>
                    </section>

                    <section id="changes">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Changes to This Policy</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                      </p>
                    </section>

                    <section id="contact">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Contact Us</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        If you have any questions about this Privacy Policy, please contact us at privacy@fixitnow.com or write to us at FixItNow Inc., 123 FixItNow Blvd, New York, NY 10001.
                      </p>
                    </section>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
