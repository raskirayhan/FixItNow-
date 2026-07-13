import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { BookingStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ["ACCEPTED", "DECLINED", "CANCELLED"],
  ACCEPTED: ["PAID", "CANCELLED"],
  DECLINED: [],
  PAID: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const CUSTOMER_CANCELLABLE: BookingStatus[] = ["REQUESTED", "ACCEPTED"];

const TECHNICIAN_TRANSITIONS: Record<string, BookingStatus[]> = {
  REQUESTED: ["ACCEPTED", "DECLINED"],
  PAID: ["IN_PROGRESS", "COMPLETED"],
  IN_PROGRESS: ["COMPLETED"],
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceId, scheduledAt, timeSlot } = req.body;
    const customerId = req.user!.userId;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { technician: true },
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
        errorDetails: {},
      });
      return;
    }

    if (service.technicianId === customerId) {
      res.status(400).json({
        success: false,
        message: "You cannot book your own service",
        errorDetails: {},
      });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        technicianId: service.technicianId,
        serviceId,
        scheduledAt: new Date(scheduledAt),
        timeSlot,
        status: "REQUESTED",
        totalAmount: service.price,
      },
      include: {
        service: { include: { category: true } },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status: newStatus } = req.body;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
        errorDetails: {},
      });
      return;
    }

    if (userRole === "CUSTOMER") {
      if (booking.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "You can only modify your own bookings",
          errorDetails: {},
        });
        return;
      }

      if (newStatus !== "CANCELLED") {
        res.status(400).json({
          success: false,
          message: "Customers can only cancel bookings",
          errorDetails: {},
        });
        return;
      }

      if (!CUSTOMER_CANCELLABLE.includes(booking.status)) {
        res.status(400).json({
          success: false,
          message: `Cannot cancel booking in ${booking.status} status. Bookings can only be cancelled before being paid.`,
          errorDetails: {
            currentStatus: booking.status,
            cancellableStatuses: CUSTOMER_CANCELLABLE,
          },
        });
        return;
      }
    }

    if (userRole === "TECHNICIAN") {
      if (booking.technicianId !== userId) {
        res.status(403).json({
          success: false,
          message: "You can only modify bookings assigned to you",
          errorDetails: {},
        });
        return;
      }

      const allowedTechTransitions = TECHNICIAN_TRANSITIONS[booking.status] || [];
      if (!allowedTechTransitions.includes(newStatus)) {
        res.status(400).json({
          success: false,
          message: `Cannot transition from ${booking.status} to ${newStatus} as a technician`,
          errorDetails: {
            currentStatus: booking.status,
            requestedStatus: newStatus,
            allowedTransitions: allowedTechTransitions,
          },
        });
        return;
      }
    }

    const validNextStatuses = VALID_TRANSITIONS[booking.status];
    if (!validNextStatuses.includes(newStatus)) {
      res.status(400).json({
        success: false,
        message: `Invalid status transition from ${booking.status} to ${newStatus}`,
        errorDetails: {
          currentStatus: booking.status,
          requestedStatus: newStatus,
          allowedTransitions: validNextStatuses,
        },
      });
      return;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: newStatus },
      include: {
        service: { include: { category: true } },
        customer: {
          select: { id: true, name: true, email: true },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${newStatus}`,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: { customerId },
      include: {
        service: { include: { category: true } },
        technician: {
          select: { id: true, name: true, email: true, phone: true },
        },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Customer bookings retrieved",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnicianBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const technicianId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: { technicianId },
      include: {
        service: { include: { category: true } },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Technician bookings retrieved",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
