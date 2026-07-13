import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, email: true, name: true, phone: true, location: true,
        role: true, status: true, createdAt: true, updatedAt: true,
        technicianProfile: true,
        customerProfile: true,
        wallet: { select: { balance: true } },
      },
    });
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, location, bio } = req.body;
    const userId = req.user!.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { ...(name && { name }), ...(phone && { phone }), ...(location && { location }) },
      select: { id: true, email: true, name: true, phone: true, location: true, role: true, status: true },
    });

    if (req.user!.role === "CUSTOMER" && bio !== undefined) {
      await prisma.customerProfile.upsert({
        where: { userId },
        update: { bio },
        create: { userId, bio },
      });
    }

    res.status(200).json({ success: true, message: "Profile updated", data: user });
  } catch (error) { next(error); }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) { res.status(400).json({ success: false, message: "Current password is incorrect" }); return; }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) { next(error); }
};

export const updateTechnicianProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bio, experienceYears, skills, baseHourlyRate } = req.body;
    const profile = await prisma.technicianProfile.update({
      where: { userId: req.user!.userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(experienceYears !== undefined && { experienceYears }),
        ...(skills !== undefined && { skills }),
        ...(baseHourlyRate !== undefined && { baseHourlyRate }),
      },
    });
    res.status(200).json({ success: true, message: "Technician profile updated", data: profile });
  } catch (error) { next(error); }
};
