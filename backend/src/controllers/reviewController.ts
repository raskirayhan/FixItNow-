import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getTechnicianReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      where: { technicianId: req.params.technicianId as string },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) { next(error); }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId, rating, comment } = req.body;
    const customerId = req.user!.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
        errorDetails: {},
      });
      return;
    }

    if (booking.customerId !== customerId) {
      res.status(403).json({
        success: false,
        message: "You can only review your own bookings",
        errorDetails: {},
      });
      return;
    }

    if (booking.status !== "COMPLETED") {
      res.status(400).json({
        success: false,
        message: "You can only review completed bookings",
        errorDetails: {},
      });
      return;
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      res.status(409).json({
        success: false,
        message: "You have already reviewed this booking",
        errorDetails: {},
      });
      return;
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        customerId,
        technicianId: booking.technicianId,
        rating,
        comment,
      },
      include: {
        customer: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
