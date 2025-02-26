import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscribeToCrypto = async (req: Request, res: Response): Promise<void> => {
    const { userId, cryptoId } = req.body;

    if (!userId || !cryptoId) {
        res.status(400).json({ error: "userId и cryptoId обязательны" });
        return;
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { userId: userId.toString() },
        });

        if (!userExists) {
            res.status(400).json({ error: "Пользователь не найден" });
            return;
        }

        const cryptoExists = await prisma.crypto.findUnique({
            where: { id: Number(cryptoId) },
        });

        if (!cryptoExists) {
            res.status(400).json({ error: "Криптовалюта не найдена" });
            return;
        }

        const existingSubscription = await prisma.subscription.findFirst({
            where: { userId: userId, cryptoId: Number(cryptoId) },
        });

        if (existingSubscription) {
            res.status(400).json({ error: "Вы уже подписаны на эту валюту" });
            return;
        }

        const subscription = await prisma.subscription.create({
            data: { userId: userId, cryptoId: Number(cryptoId) },
        });

        res.json(subscription);
    } catch (error) {
        console.error("Ошибка подписки:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
