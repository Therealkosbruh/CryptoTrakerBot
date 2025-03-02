import * as dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { fetchAndStoreCryptoData, getChangedCryptos } from "./services/cryptoService";
import { subscribeToCrypto, unsubscribeFromCrypto, getUserSubscriptions } from "./constollers/subscribeController";
import { PrismaClient } from "@prisma/client";

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

app.get("/subscriptions/:userId", getUserSubscriptions);

app.post("/subscribe", subscribeToCrypto);

app.post("/unsubscribe", unsubscribeFromCrypto);

app.get("/update-crypto", async (req: Request, res: Response) => {
    try {
        await fetchAndStoreCryptoData();
        res.status(200).json({ message: "Данные о криптовалютах обновлены!" });
    } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.get("/changed-cryptos", async (req: Request, res: Response) => {
    try {
        const changedCryptos = await getChangedCryptos();
        res.json(changedCryptos);
    } catch (error) {
        console.error("Ошибка при получении изменившихся криптовалют:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

const checkAndSendChangedCryptos = async () => {
    try {
        const changedCryptos = await getChangedCryptos();
        if (changedCryptos.length > 0) {
            console.log("Изменившиеся криптовалюты:", changedCryptos);
        }
    } catch (error) {
        console.error("Ошибка при получении изменившихся криптовалют:", error);
    }
};

setTimeout(() => {
    checkAndSendChangedCryptos();
    setInterval(checkAndSendChangedCryptos, 5 * 60 * 1000);
}, 5 * 60 * 1000);


app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
