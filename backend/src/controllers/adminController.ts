import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        technicianProfile: true,
        _count: {
          select: {
            customerBookings: true,
            technicianBookings: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "All users retrieved",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorDetails: {},
      });
      return;
    }

    if (user.role === "ADMIN") {
      res.status(400).json({
        success: false,
        message: "Cannot modify the status of an admin user",
        errorDetails: {},
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `User ${status === "BANNED" ? "banned" : "unbanned"} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: { include: { category: true } },
        customer: {
          select: { id: true, name: true, email: true },
        },
        technician: {
          select: { id: true, name: true, email: true },
        },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "All bookings retrieved",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTechnicians = await prisma.user.count({
      where: { role: "TECHNICIAN" },
    });
    const totalCustomers = await prisma.user.count({
      where: { role: "CUSTOMER" },
    });
    const totalServices = await prisma.service.count();
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const recentBookings = await prisma.booking.findMany({
      take: 10,
      include: {
        service: { select: { title: true } },
        customer: { select: { name: true } },
        technician: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved",
      data: {
        totalUsers,
        totalTechnicians,
        totalCustomers,
        totalServices,
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        bookingsByStatus,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { services: true } },
      },
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
