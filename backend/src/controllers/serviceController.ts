import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { name: "asc" },
    });
    res.status(200).json({
      success: true,
      message: "Categories retrieved",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoryId, title, description, price } = req.body;
    const technicianId = req.user!.userId;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
        errorDetails: {},
      });
      return;
    }

    const service = await prisma.service.create({
      data: {
        technicianId,
        categoryId,
        title,
        description,
        price,
      },
      include: {
        category: true,
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, categoryId, minRating } = req.query;

    const where: Record<string, unknown> = {};

    if (search && typeof search === "string") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId && typeof categoryId === "string") {
      where.categoryId = categoryId;
    }

    const rawServices = await prisma.service.findMany({
      where,
      include: {
        category: true,
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
          },
        },
        bookings: {
          select: {
            review: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    type ServiceWithBookings = (typeof rawServices)[number];
    let services: ServiceWithBookings[] = rawServices;

    if (minRating && typeof minRating === "string") {
      const minRatingNum = parseFloat(minRating);
      services = rawServices.filter((svc) => {
        const ratings = (svc as ServiceWithBookings & { bookings: { review: { rating: number } | null }[] }).bookings
          .map((b) => b.review?.rating)
          .filter((r): r is number => r !== undefined && r !== null);
        if (ratings.length === 0) return false;
        const avg = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
        return avg >= minRatingNum;
      });
    }

    const servicesWithAvgRating = services.map((service) => {
      const svcBookings = (service as ServiceWithBookings & { bookings: { review: { rating: number } | null }[] }).bookings;
      const ratings = svcBookings
        .map((b) => b.review?.rating)
        .filter((r): r is number => r !== undefined && r !== null);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
          : null;
      const reviewCount = ratings.length;
      const { bookings: _bookings, ...serviceWithoutBookings } = service as ServiceWithBookings & { bookings: unknown[] };
      return {
        ...serviceWithoutBookings,
        avgRating,
        reviewCount,
      };
    });

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: servicesWithAvgRating,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            technicianProfile: true,
          },
        },
        bookings: {
          select: {
            review: {
              select: {
                rating: true,
                comment: true,
                customer: {
                  select: { id: true, name: true },
                },
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
        errorDetails: {},
      });
      return;
    }

    const svcWithBookings = service as typeof service & {
      bookings: { review: { rating: number; comment: string | null; customer: { id: string; name: string }; createdAt: Date } | null }[];
    };

    const ratings = svcWithBookings.bookings
      .map((b) => b.review?.rating)
      .filter((r): r is number => r !== undefined && r !== null);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : null;
    const reviews = svcWithBookings.bookings
      .map((b) => b.review)
      .filter(
        (r): r is NonNullable<typeof r> => r !== null && r !== undefined
      );
    const { bookings: _bookings, ...serviceData } = service;

    res.status(200).json({
      success: true,
      message: "Service retrieved",
      data: {
        ...serviceData,
        avgRating,
        reviewCount: ratings.length,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnicianServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const technicianId = req.params.technicianId as string;

    const services = await prisma.service.findMany({
      where: {
        OR: [
          { technicianId: technicianId },
          { technician: { id: technicianId } },
          { technician: { technicianProfile: { id: technicianId } } }
        ]
      },
      include: {
        category: true,
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            createdAt: true,
            technicianProfile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Technician services retrieved",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};
