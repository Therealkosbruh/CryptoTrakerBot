import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { fetchAndStoreCryptoData } from "./services/cryptoService";
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/cryptos", async (req: Request, res: Response) => {
    try {
        const cryptos = await prisma.crypto.findMany();
        res.json(cryptos);
    } catch (error) {
        console.error("Error getting cryptolist:", error);
        res.status(500).json({ error: `Ошибка сервера ${error}` });
    }
});

app.post(
    "/subscribe",
    async (req: Request, res: Response): Promise<void> => {
        const { userId, cryptoId } = req.body;

        if (!userId || !cryptoId) {
            res.status(400).json({ error: "userId и cryptoId обязательны" });
            return;
        }

        try {
            const existingSubscription = await prisma.subscription.findFirst({
                where: {
                    userId: Number(userId),
                    cryptoId: Number(cryptoId),
                },
            });

            if (existingSubscription) {
                res.status(400).json({ error: "Вы уже подписаны на эту валюту" });
                return;
            }

            const subscription = await prisma.subscription.create({
                data: { userId: Number(userId), cryptoId: Number(cryptoId) },
            });

            res.json(subscription);
        } catch (error) {
            console.error("Ошибка подписки:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
);

app.get("/update-crypto", async (req: Request, res: Response) => {
    try {
        await fetchAndStoreCryptoData();
        res.status(200).json({ message: "Данные о криптовалютах обновлены!" });
    } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});



