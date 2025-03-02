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

export const unsubscribeFromCrypto = async (req: Request, res: Response): Promise<void> => {
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

        if (!existingSubscription) {
            res.status(400).json({ error: "Вы не подписаны на эту валюту" });
            return;
        }

        await prisma.subscription.delete({
            where: { id: existingSubscription.id },
        });

        res.json({ message: "Вы успешно отписались от криптовалюты" });
    } catch (error) {
        console.error("Ошибка отписки:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export const getUserSubscriptions = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
        res.status(400).json({ error: "userId обязателен" });
        return;
    }

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: { userId },
            include: {
                crypto: true,
            },
        });

        if (subscriptions.length === 0) {
            res.status(404).json({ error: "Подписки не найдены" });
            return;
        }

        res.json(subscriptions.map(sub => sub.crypto));
    } catch (error) {
        console.error("Ошибка при получении подписок:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
