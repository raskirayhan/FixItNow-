import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createServiceSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
});

export const createBookingSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  scheduledAt: z.string().datetime("Invalid date format"),
  timeSlot: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    "ACCEPTED",
    "DECLINED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});

export const adminUpdateUserSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED"]).optional(),
  role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"]).optional(),
});
