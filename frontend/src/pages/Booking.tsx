import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Wrench,
  Loader2,
  CheckCircle2,
  Home,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatCurrency } from "@/lib/utils";
import { useServices, useCreateBooking } from "@/hooks/useApi";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StarRating from "@/components/shared/StarRating";

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Valid zip code is required").max(10),
  notes: z.string().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

interface BookingState {
  step: number;
  selectedService: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  address: AddressForm | null;
  isSubmitting: boolean;
  isComplete: boolean;
}

const STEPS = [
  { id: 1, title: "Service", icon: Wrench },
  { id: 2, title: "Date", icon: Calendar },
  { id: 3, title: "Time", icon: Clock },
  { id: 4, title: "Address", icon: MapPin },
  { id: 5, title: "Summary", icon: CreditCard },
];

const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const UNAVAILABLE_SLOTS = ["11:00 AM", "2:00 PM", "4:00 PM"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function generateDates(count: number) {
  const dates: { date: Date; day: string; dayNum: number; month: string; weekday: string; isToday: boolean }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push({
      date: d,
      day: d.toISOString().split("T")[0],
      dayNum: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      weekday: DAY_NAMES[d.getDay()],
      isToday: i === 0,
    });
  }
  return dates;
}

export default function Booking() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { isDark } = useThemeContext();
  const queryClient = useQueryClient();

  const servicesQuery = useServices();
  const createBooking = useCreateBooking();

  const [state, setState] = useState<BookingState>({
    step: 1,
    selectedService: serviceId || null,
    selectedDate: null,
    selectedTime: null,
    address: null,
    isSubmitting: false,
    isComplete: false,
  });

  const [bookingResult, setBookingResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
    },
  });

  const dates = useMemo(() => generateDates(30), []);

  const enrichedServices = useMemo(
    () => (servicesQuery.data?.data || []) as any[],
    [servicesQuery.data]
  );

  const selectedServiceData = enrichedServices.find((s: any) => s.id === state.selectedService);
  const selectedDateObj = dates.find((d) => d.day === state.selectedDate);

  const platformFee = selectedServiceData ? selectedServiceData.price * 0.1 : 0;
  const totalAmount = selectedServiceData ? selectedServiceData.price + platformFee : 0;

  const canGoNext = () => {
    switch (state.step) {
      case 1: return !!state.selectedService;
      case 2: return !!state.selectedDate;
      case 3: return !!state.selectedTime;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (state.step === 4) {
      handleSubmit(onAddressSubmit)();
      return;
    }
    if (state.step < 5) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const goBack = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const goToStep = (step: number) => {
    if (step < state.step) {
      setState((prev) => ({ ...prev, step }));
    }
  };

  const onAddressSubmit = (data: AddressForm) => {
    setState((prev) => ({ ...prev, address: data, step: 5 }));
  };

  const handleConfirm = async () => {
    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      const result = await createBooking.mutateAsync({
        serviceId: state.selectedService!,
        scheduledAt: state.selectedDate || new Date().toISOString(),
        timeSlot: state.selectedTime || undefined,
      });
      setBookingResult(result?.data);
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      setState((prev) => ({ ...prev, isSubmitting: false, isComplete: true }));
    } catch (error: any) {
      setState((prev) => ({ ...prev, isSubmitting: false }));
      toast({ title: "Booking Failed", description: error?.response?.data?.message || "Something went wrong. Please try again.", variant: "error" });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    goNext();
  };

  const handlePrev = () => {
    setDirection(-1);
    goBack();
  };

  // Success screen
  if (state.isComplete) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center px-4", isDark ? "bg-slate-900" : "bg-slate-50")}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center"
        >
          {/* Confetti particles */}
          <div className="relative mb-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [0, -(Math.random() * 200 + 100)],
                  x: [0, (Math.random() - 0.5) * 300],
                  rotate: [0, Math.random() * 360],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className={cn(
                  "absolute left-1/2 top-1/2 h-3 w-3 rounded-full",
                  [
                    "bg-primary-500",
                    "bg-yellow-400",
                    "bg-green-400",
                    "bg-blue-400",
                    "bg-pink-400",
                    "bg-violet-400",
                    "bg-orange-400",
                  ][i % 7]
                )}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
            >
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn("text-3xl font-extrabold", isDark ? "text-white" : "text-slate-900")}
          >
            Booking Confirmed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={cn("mt-3 text-lg", isDark ? "text-slate-400" : "text-slate-500")}
          >
            Your appointment has been successfully booked.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Badge variant="success" className="px-4 py-1.5 text-sm">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {bookingResult?.id ? `Booking #${bookingResult.id.slice(-8).toUpperCase()}` : "Confirmation email sent"}
            </Badge>
          </motion.div>

          {selectedServiceData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={cn(
                "mx-auto mt-8 max-w-sm rounded-2xl border p-6 text-left",
                isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
              )}
            >
              <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                {selectedServiceData.title}
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                    {selectedDateObj
                      ? `${selectedDateObj.weekday}, ${selectedDateObj.month} ${selectedDateObj.dayNum}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary-500" />
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>{state.selectedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                    {state.address?.street}, {state.address?.city}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total Paid</span>
                <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/customer">
              <Button className="!rounded-xl !px-6">
                View My Bookings
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="!rounded-xl !px-6">
                <Home className="mr-1 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isDark ? "bg-slate-900" : "bg-slate-50")}>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Steps Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const isActive = state.step === step.id;
              const isCompleted = state.step > step.id;
              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => goToStep(step.id)}
                      disabled={!isCompleted}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                        isCompleted
                          ? "border-green-500 bg-green-500 text-white cursor-pointer"
                          : isActive
                            ? "border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                            : isDark
                              ? "border-slate-600 bg-slate-800 text-slate-400"
                              : "border-slate-200 bg-white text-slate-400"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "mt-2 hidden text-xs font-medium sm:block",
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="mx-2 flex-1 sm:mx-4">
                      <div className={cn("h-0.5 rounded-full transition-colors duration-300", isDark ? "bg-slate-700" : "bg-slate-200")}>
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isCompleted ? "bg-green-500 w-full" : "bg-transparent w-0"
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Step 1: Choose Service */}
            {state.step === 1 && (
              <div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Choose a Service
                </h2>
                <p className={cn("mt-2 mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                  Select the service you'd like to book
                </p>
                {servicesQuery.isLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={cn("animate-pulse rounded-2xl border p-4", isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white")}>
                        <div className="flex items-start gap-4">
                          <div className={cn("h-16 w-16 shrink-0 rounded-xl", isDark ? "bg-slate-700" : "bg-slate-200")} />
                          <div className="flex-1 space-y-3">
                            <div className={cn("h-4 w-3/4 rounded", isDark ? "bg-slate-700" : "bg-slate-200")} />
                            <div className={cn("h-3 w-1/2 rounded", isDark ? "bg-slate-700" : "bg-slate-200")} />
                            <div className={cn("h-3 w-1/4 rounded", isDark ? "bg-slate-700" : "bg-slate-200")} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : servicesQuery.error ? (
                  <div className={cn("rounded-2xl border p-8 text-center", isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white")}>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      Failed to load services. Please try again.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => servicesQuery.refetch()}>
                      Retry
                    </Button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {enrichedServices.map((service: any) => (
                    <motion.button
                      key={service.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setState((prev) => ({ ...prev, selectedService: service.id }))}
                      className={cn(
                        "flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                        state.selectedService === service.id
                          ? "border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-500/20 dark:bg-primary-900/20"
                          : isDark
                            ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-xl", isDark ? "bg-slate-700" : "bg-slate-100")}>
                          <Wrench className="h-6 w-6 text-primary-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={cn("text-sm font-bold truncate", isDark ? "text-white" : "text-slate-900")}>
                          {service.title}
                        </h3>
                        {service.category && (
                          <Badge variant="secondary" className="mt-1 text-[10px]">
                            {service.category.name}
                          </Badge>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-bold text-primary-600">
                            {formatCurrency(service.price)}
                          </span>
                          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                            / {service.duration || "session"}
                          </span>
                        </div>
                      </div>
                      {state.selectedService === service.id && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Step 2: Choose Date */}
            {state.step === 2 && (
              <div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Select a Date
                </h2>
                <p className={cn("mt-2 mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                  Choose your preferred appointment date
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 sm:gap-3">
                  {dates.map((d) => (
                    <motion.button
                      key={d.day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setState((prev) => ({ ...prev, selectedDate: d.day }))}
                      className={cn(
                        "flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-200",
                        state.selectedDate === d.day
                          ? "border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                          : d.isToday
                            ? isDark
                              ? "border-primary-800 bg-primary-900/20 text-white hover:border-primary-600"
                              : "border-primary-200 bg-primary-50 text-slate-900 hover:border-primary-400"
                            : isDark
                              ? "border-slate-700 bg-slate-800 text-white hover:border-slate-600"
                              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                      )}
                    >
                      <span className={cn(
                        "text-[10px] font-semibold uppercase",
                        state.selectedDate === d.day ? "text-white/80" : isDark ? "text-slate-400" : "text-slate-500"
                      )}>
                        {d.weekday}
                      </span>
                      <span className={cn("mt-1 text-lg font-bold", state.selectedDate === d.day ? "text-white" : "")}>
                        {d.dayNum}
                      </span>
                      <span className={cn(
                        "text-[10px]",
                        state.selectedDate === d.day ? "text-white/70" : isDark ? "text-slate-500" : "text-slate-400"
                      )}>
                        {d.month.slice(0, 3)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Choose Time */}
            {state.step === 3 && (
              <div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Pick a Time Slot
                </h2>
                <p className={cn("mt-2 mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                  {selectedDateObj
                    ? `Available times for ${selectedDateObj.weekday}, ${selectedDateObj.month} ${selectedDateObj.dayNum}`
                    : "Select your preferred time"}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {TIME_SLOTS.map((slot) => {
                    const unavailable = UNAVAILABLE_SLOTS.includes(slot);
                    const selected = state.selectedTime === slot;
                    return (
                      <motion.button
                        key={slot}
                        whileHover={!unavailable ? { scale: 1.03 } : undefined}
                        whileTap={!unavailable ? { scale: 0.97 } : undefined}
                        disabled={unavailable}
                        onClick={() => !unavailable && setState((prev) => ({ ...prev, selectedTime: slot }))}
                        className={cn(
                          "flex flex-col items-center rounded-xl border px-4 py-4 text-center transition-all duration-200",
                          unavailable
                            ? isDark
                              ? "cursor-not-allowed border-slate-700/50 bg-slate-800/30 text-slate-600"
                              : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 line-through"
                            : selected
                              ? "border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                              : isDark
                                ? "border-slate-700 bg-slate-800 text-white hover:border-primary-600"
                                : "border-slate-200 bg-white text-slate-900 hover:border-primary-400"
                        )}
                      >
                        <Clock className={cn("mb-1 h-5 w-5", selected ? "text-white" : unavailable ? "opacity-30" : "text-primary-500")} />
                        <span className="text-sm font-semibold">{slot}</span>
                        {unavailable && (
                          <span className={cn("mt-1 text-[10px]", selected ? "text-white/70" : isDark ? "text-slate-600" : "text-slate-400")}>
                            Unavailable
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Address */}
            {state.step === 4 && (
              <div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Service Address
                </h2>
                <p className={cn("mt-2 mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                  Where should the technician come?
                </p>
                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-5">
                  <Card>
                    <CardContent className="pt-6 space-y-5">
                      <div>
                        <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                          Street Address *
                        </label>
                        <input
                          {...register("street", { required: "Street address is required" })}
                          placeholder="123 Main Street"
                          className={cn(
                            "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
                            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                            errors.street
                              ? "border-red-500"
                              : isDark
                                ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
                                : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                          )}
                        />
                        {errors.street && (
                          <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                            City *
                          </label>
                          <input
                            {...register("city", { required: "City is required" })}
                            placeholder="New York"
                            className={cn(
                              "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
                              "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                              errors.city
                                ? "border-red-500"
                                : isDark
                                  ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
                                  : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                            )}
                          />
                          {errors.city && (
                            <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                            State *
                          </label>
                          <input
                            {...register("state", { required: "State is required" })}
                            placeholder="NY"
                            className={cn(
                              "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
                              "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                              errors.state
                                ? "border-red-500"
                                : isDark
                                  ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
                                  : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                            )}
                          />
                          {errors.state && (
                            <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                            Zip Code *
                          </label>
                          <input
                            {...register("zip", {
                              required: "Zip code is required",
                              minLength: { value: 5, message: "Must be at least 5 characters" },
                            })}
                            placeholder="10001"
                            className={cn(
                              "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
                              "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                              errors.zip
                                ? "border-red-500"
                                : isDark
                                  ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
                                  : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                            )}
                          />
                          {errors.zip && (
                            <p className="mt-1 text-xs text-red-500">{errors.zip.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          {...register("notes")}
                          rows={3}
                          placeholder="Gate code, parking info, special instructions..."
                          className={cn(
                            "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors resize-none",
                            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                            isDark
                              ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
                              : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </div>
            )}

            {/* Step 5: Summary */}
            {state.step === 5 && (
              <div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Booking Summary
                </h2>
                <p className={cn("mt-2 mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                  Review your booking details before confirming
                </p>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-4">
                    {/* Service Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Wrench className="h-5 w-5 text-primary-500" />
                          Service Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedServiceData && (
                          <div className="flex items-start gap-4">
                            {selectedServiceData.image ? (
                              <img
                                src={selectedServiceData.image}
                                alt={selectedServiceData.title}
                                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-xl", isDark ? "bg-slate-700" : "bg-slate-100")}>
                                <Wrench className="h-8 w-8 text-primary-500" />
                              </div>
                            )}
                            <div>
                              <h3 className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>
                                {selectedServiceData.title}
                              </h3>
                              <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                {selectedServiceData.technician?.user.name}
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <StarRating rating={selectedServiceData.rating} size="sm" />
                                <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                  ({selectedServiceData.reviewCount})
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Date & Time */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Calendar className="h-5 w-5 text-primary-500" />
                          Date & Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6">
                          <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", isDark ? "bg-primary-900/30" : "bg-primary-100")}>
                            <Calendar className="h-6 w-6 text-primary-500" />
                          </div>
                          <div>
                            <p className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                              {selectedDateObj
                                ? `${selectedDateObj.weekday}, ${selectedDateObj.month} ${selectedDateObj.dayNum}`
                                : "No date selected"}
                            </p>
                            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                              {state.selectedTime || "No time selected"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Address */}
                    {state.address && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <MapPin className="h-5 w-5 text-primary-500" />
                            Service Address
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {state.address.street}
                          </p>
                          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            {state.address.city}, {state.address.state} {state.address.zip}
                          </p>
                          {state.address.notes && (
                            <p className={cn("mt-2 text-sm italic", isDark ? "text-slate-500" : "text-slate-400")}>
                              "{state.address.notes}"
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Price Breakdown Sidebar */}
                  <div>
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CreditCard className="h-5 w-5 text-primary-500" />
                          Price Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                              Service Fee
                            </span>
                            <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                              {formatCurrency(selectedServiceData?.price || 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                              Platform Fee (10%)
                            </span>
                            <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                              {formatCurrency(platformFee)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-900")}>
                              Total
                            </span>
                            <span className="text-xl font-extrabold text-primary-600">
                              {formatCurrency(totalAmount)}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={handleConfirm}
                          disabled={state.isSubmitting}
                          className="mt-6 w-full !rounded-xl !py-6 text-base"
                        >
                          {state.isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Confirm Booking
                              <Check className="ml-1 h-5 w-5" />
                            </>
                          )}
                        </Button>

                        <p className={cn("mt-3 text-center text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                          By confirming, you agree to our Terms of Service
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!state.isComplete && (
          <div className={cn("mt-8 flex items-center justify-between border-t pt-6", isDark ? "border-slate-800" : "border-slate-200")}>
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={state.step === 1}
              className="!rounded-xl !px-6"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            {state.step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="!rounded-xl !px-6"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
