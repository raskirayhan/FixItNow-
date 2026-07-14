import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility" },
  { id: "accounts", title: "User Accounts" },
  { id: "services", title: "Services" },
  { id: "payments", title: "Payments" },
  { id: "cancellation", title: "Cancellation & Refunds" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "governing", title: "Governing Law" },
  { id: "contact", title: "Contact Us" },
];

export default function Terms() {
  const { isDark } = useThemeContext();
  const [activeSection, setActiveSection] = useState("acceptance");

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
            <FileText className="mx-auto h-12 w-12 text-primary-600" />
            <h1 className={cn("mt-4 text-4xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Terms of Service
            </h1>
            <p className={cn("mt-4 text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Last updated: July 1, 2026
            </p>
          </motion.div>

          <div className="mt-16 grid gap-12 lg:grid-cols-4">
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

            <div className="lg:col-span-3 space-y-10">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="p-8 space-y-6">
                    <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                      Welcome to FixItNow. These Terms of Service govern your use of our platform and services. By accessing or using FixItNow, you agree to be bound by these terms.
                    </p>

                    <section id="acceptance">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Acceptance of Terms</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use our platform.
                      </p>
                    </section>

                    <section id="eligibility">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Eligibility</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        You must be at least 18 years old to use FixItNow. By using our platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into binding agreements.
                      </p>
                    </section>

                    <section id="accounts">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>User Accounts</h2>
                      <div className={cn("text-sm leading-relaxed space-y-3", isDark ? "text-slate-400" : "text-slate-600")}>
                        <p>When you create an account, you agree to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Provide accurate, current, and complete information</li>
                          <li>Maintain the security of your password</li>
                          <li>Accept responsibility for all activities under your account</li>
                          <li>Notify us immediately of any unauthorized use</li>
                        </ul>
                      </div>
                    </section>

                    <section id="services">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Services</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        FixItNow acts as a platform connecting customers with independent service providers. We do not directly provide home services and are not responsible for the quality, safety, or legality of services performed by technicians.
                      </p>
                    </section>

                    <section id="payments">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Payments</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        Payments are processed through our secure payment system. You agree to pay all charges incurred under your account. FixItNow charges a service fee on each transaction. All prices are displayed in USD unless otherwise noted.
                      </p>
                    </section>

                    <section id="cancellation">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Cancellation & Refunds</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        You may cancel a booking up to 24 hours before the scheduled time at no charge. Cancellations within 24 hours may incur a fee. Refund requests are handled on a case-by-case basis and must be submitted within 48 hours of service completion.
                      </p>
                    </section>

                    <section id="liability">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Limitation of Liability</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        FixItNow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
                      </p>
                    </section>

                    <section id="governing">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Governing Law</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of New York, NY.
                      </p>
                    </section>

                    <section id="contact">
                      <h2 className={cn("text-xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>Contact Us</h2>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                        If you have any questions about these Terms, please contact us at legal@fixitnow.com or write to FixItNow Inc., 123 FixItNow Blvd, New York, NY 10001.
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
