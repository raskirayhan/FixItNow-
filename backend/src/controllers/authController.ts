import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { sendOtpEmail } from "../services/emailService";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Fallback in-memory store for instant high-availability OTP resolution
interface MemoryOtp {
  code: string;
  expiresAt: Date;
  verified: boolean;
  purpose: string;
  trackingId: string;
}
const otpStore = new Map<string, MemoryOtp>();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, phone, location, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "A user with this email already exists",
        errorDetails: {},
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const assignedRole = role || "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        location: location || null,
        role: assignedRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Create role-specific profile & starter wallet
    try {
      if (user.role === "TECHNICIAN") {
        await prisma.technicianProfile.create({
          data: {
            userId: user.id,
            bio: "Certified FixItNow Technician",
            experienceYears: 1,
            skills: ["General Repairs"],
            baseHourlyRate: 50,
          },
        });
      } else {
        await prisma.customerProfile.create({
          data: {
            userId: user.id,
            bio: "Homeowner",
            emergencyContact: phone || "",
          },
        });
      }

      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 100, // $100 welcome bonus balance for new users
          totalEarned: 0,
          totalSpent: 0,
        },
      });
    } catch (profileErr) {
      console.warn("Secondary profile/wallet creation warning:", profileErr);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errorDetails: {},
      });
      return;
    }

    if (user.status === "BANNED") {
      res.status(403).json({
        success: false,
        message: "Your account has been banned. Contact support.",
        errorDetails: {},
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errorDetails: {},
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
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
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorDetails: {},
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// COURIER-GRADE EMAIL OTP SYSTEM
// ==========================================

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, purpose = "Password Reset & Verification" } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Generate random secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const trackingId = `CR-${Date.now().toString(36).toUpperCase()}`;

    // 1. Store in memory cache
    otpStore.set(cleanEmail, {
      code: otp,
      expiresAt,
      verified: false,
      purpose,
      trackingId,
    });

    // 2. Persist in Database if Otp model available
    try {
      if ((prisma as any).otp) {
        await (prisma as any).otp.create({
          data: {
            email: cleanEmail,
            code: otp,
            purpose,
            expiresAt,
            verified: false,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB OTP persistence skipped, using memory cache:", dbErr);
    }

    // 3. Dispatch Email via Courier Service
    await sendOtpEmail({
      email: cleanEmail,
      otp,
      purpose,
      trackingId,
    });

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}. Valid for 10 minutes.`,
      data: {
        email: cleanEmail,
        trackingId,
        purpose,
        demoOtp: otp, // Surfaced for instant testability like a courier SMS/notification
        expiresInSeconds: 600,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Check memory store
    const memRecord = otpStore.get(cleanEmail);
    const now = new Date();

    let isValid = false;
    if (memRecord && memRecord.code === cleanOtp && memRecord.expiresAt > now) {
      memRecord.verified = true;
      isValid = true;
    }

    // Also check database
    if (!isValid && (prisma as any).otp) {
      try {
        const dbRecord = await (prisma as any).otp.findFirst({
          where: {
            email: cleanEmail,
            code: cleanOtp,
            expiresAt: { gt: now },
          },
          orderBy: { createdAt: "desc" },
        });
        if (dbRecord) {
          await (prisma as any).otp.update({
            where: { id: dbRecord.id },
            data: { verified: true },
          });
          isValid = true;
        }
      } catch (dbErr) {
        console.warn("DB OTP query warning:", dbErr);
      }
    }

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please request a new one.",
        errorDetails: {},
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You may now proceed.",
      data: {
        email: cleanEmail,
        verified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Verify OTP first
    const memRecord = otpStore.get(cleanEmail);
    const now = new Date();
    let isOtpValid = memRecord && memRecord.code === cleanOtp && memRecord.expiresAt > now;

    if (!isOtpValid && (prisma as any).otp) {
      try {
        const dbRecord = await (prisma as any).otp.findFirst({
          where: {
            email: cleanEmail,
            code: cleanOtp,
            expiresAt: { gt: now },
          },
          orderBy: { createdAt: "desc" },
        });
        if (dbRecord) isOtpValid = true;
      } catch (dbErr) {
        console.warn("DB OTP verify warning:", dbErr);
      }
    }

    if (!isOtpValid) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new verification code.",
        errorDetails: {},
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No user found with this email address.",
        errorDetails: {},
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword },
    });

    // Clean up OTP
    otpStore.delete(cleanEmail);

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const memRecord = otpStore.get(cleanEmail);
    const now = new Date();
    let isOtpValid = memRecord && memRecord.code === cleanOtp && memRecord.expiresAt > now;

    if (!isOtpValid && (prisma as any).otp) {
      try {
        const dbRecord = await (prisma as any).otp.findFirst({
          where: {
            email: cleanEmail,
            code: cleanOtp,
            expiresAt: { gt: now },
          },
          orderBy: { createdAt: "desc" },
        });
        if (dbRecord) isOtpValid = true;
      } catch (dbErr) {
        console.warn("DB OTP login warning:", dbErr);
      }
    }

    if (!isOtpValid) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired OTP code.",
        errorDetails: {},
      });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // If user does not exist, auto-create customer account
    if (!user) {
      const defaultPassword = await bcrypt.hash("Password123!", 12);
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          password: defaultPassword,
          role: "CUSTOMER",
          status: "ACTIVE",
        },
      });

      try {
        await prisma.wallet.create({
          data: { userId: user.id, balance: 100 },
        });
      } catch (wErr) {
        console.warn("Auto wallet warning:", wErr);
      }
    }

    if (user.status === "BANNED") {
      res.status(403).json({
        success: false,
        message: "Your account is banned. Contact support.",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    otpStore.delete(cleanEmail);

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Logged in successfully via Courier OTP",
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    next(error);
  }
};
