import { Request, Response, NextFunction } from "express";
import stripe from "../config/stripe";
import prisma from "../config/db";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: { select: { id: true, email: true, name: true } },
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
        errorDetails: {},
      });
      return;
    }

    if (booking.status !== "ACCEPTED") {
      res.status(400).json({
        success: false,
        message: "Payment can only be made for accepted bookings",
        errorDetails: { currentStatus: booking.status },
      });
      return;
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId },
    });

    if (existingPayment && existingPayment.status === "COMPLETED") {
      res.status(400).json({
        success: false,
        message: "This booking has already been paid for",
        errorDetails: {},
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: "usd",
      metadata: {
        bookingId: booking.id,
        customerId: booking.customerId,
        technicianId: booking.technicianId,
      },
    });

    if (existingPayment) {
      await prisma.payment.update({
        where: { bookingId },
        data: {
          transactionId: paymentIntent.id,
          amount: booking.totalAmount,
          status: "PENDING",
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId,
          transactionId: paymentIntent.id,
          amount: booking.totalAmount,
          provider: "STRIPE",
          status: "PENDING",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment intent created",
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      res.status(400).json({
        success: false,
        message: "Webhook signature verification failed",
        errorDetails: {},
      });
      return;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "PAID" },
        });

        await prisma.payment.update({
          where: { bookingId },
          data: {
            status: "COMPLETED",
            paidAt: new Date(),
          },
        });
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.bookingId;

      if (bookingId) {
        const payment = await prisma.payment.findUnique({
          where: { bookingId },
        });

        if (payment) {
          await prisma.payment.update({
            where: { bookingId },
            data: { status: "FAILED" },
          });
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing error",
      errorDetails: {},
    });
  }
};
