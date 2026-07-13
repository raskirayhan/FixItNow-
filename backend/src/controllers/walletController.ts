import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId: req.user!.userId } });
    }
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.status(200).json({ success: true, data: { ...wallet, transactions } });
  } catch (error) { next(error); }
};

export const addMoney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, description } = req.body;
    if (!amount || amount <= 0) { res.status(400).json({ success: false, message: "Invalid amount" }); return; }

    let wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.userId } });
    if (!wallet) { wallet = await prisma.wallet.create({ data: { userId: req.user!.userId } }); }

    const [updatedWallet, transaction] = await prisma.$transaction([
      prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: amount }, totalSpent: { increment: amount } } }),
      prisma.walletTransaction.create({ data: { walletId: wallet.id, type: "credit", amount, description: description || "Added to wallet", status: "COMPLETED" } }),
    ]);

    res.status(200).json({ success: true, message: "Money added successfully", data: { wallet: updatedWallet, transaction } });
  } catch (error) { next(error); }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.userId } });
    if (!wallet) { res.status(200).json({ success: true, data: [] }); return; }
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) { next(error); }
};
