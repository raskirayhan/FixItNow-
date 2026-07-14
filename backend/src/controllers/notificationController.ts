import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.userId, read: false },
    });
    res.status(200).json({ success: true, message: "Notifications retrieved", data: { notifications, unreadCount } });
  } catch (error) { next(error); }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id as string },
    });

    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found", errorDetails: {} });
      return;
    }

    if (notification.userId !== req.user!.userId) {
      res.status(403).json({ success: false, message: "Access denied", errorDetails: {} });
      return;
    }

    await prisma.notification.update({
      where: { id: req.params.id as string },
      data: { read: true },
    });
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) { next(error); }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, read: false },
      data: { read: true },
    });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) { next(error); }
};

export const createNotification = async (userId: string, title: string, message: string, type: string = "info") => {
  return prisma.notification.create({ data: { userId, title, message, type } });
};
