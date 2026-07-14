import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { faqs } from "@/mock/data";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "support@fixitnow.com",
    subtext: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+1 (555) 123-4567",
    subtext: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "123 FixItNow Blvd",
    subtext: "New York, NY 10001",
  },
  {
    icon: Clock,
    title: "Working Hours",
    detail: "Mon - Fri: 9am - 6pm",
    subtext: "Weekend support available",
  },
];

export default function Contact() {
  const { isDark } = useThemeContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactForm) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
  };

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
              <span className={cn(isDark ? "text-white" : "text-slate-900")}>Get in </span>
              <span className="text-gradient">Touch</span>
            </h1>
            <p
              className={cn(
                "mx-auto mt-6 max-w-2xl text-lg",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              Have a question, suggestion, or need help? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={cn("px-4 py-16 sm:px-6 lg:px-8", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                      <info.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3
                      className={cn(
                        "mt-4 font-semibold",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {info.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary-600">{info.detail}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {info.subtext}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={cn(
                  "text-2xl font-bold tracking-tight",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Send us a message
              </h2>
              <p className={cn("mt-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <Send className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-emerald-800">Message Sent!</h3>
                  <p className="mt-2 text-sm text-emerald-600">
                    Thank you for reaching out. We&apos;ll respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Name"
                      placeholder="Your name"
                      icon={<MessageSquare className="h-4 w-4" />}
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      icon={<Mail className="h-4 w-4" />}
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Subject</label>
                    <Select onValueChange={(value) => setValue("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-xs text-red-500">{errors.subject.message}</p>
                    )}
                  </div>

                  <Textarea
                    label="Message"
                    placeholder="How can we help you?"
                    rows={5}
                    maxLength={1000}
                    showCount
                    error={errors.message?.message}
                    {...register("message")}
                  />

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className={cn(
                  "flex h-80 items-center justify-center rounded-2xl border",
                  isDark
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-slate-100"
                )}
              >
                <div className="text-center">
                  <MapPin className={cn("mx-auto h-12 w-12", isDark ? "text-slate-600" : "text-slate-300")} />
                  <p className={cn("mt-2 text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                    Interactive Map
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={cn("px-4 py-20 sm:px-6 lg:px-8", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <HelpCircle className="mx-auto h-10 w-10 text-primary-600" />
            <h2
              className={cn(
                "mt-4 text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={cn(
                    "rounded-xl border px-5",
                    isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
                  )}
                >
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
