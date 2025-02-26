import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { sendTelegramMessage } from "./telegramService"; 

const prisma = new PrismaClient();
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const MAX_PAGES = 5;
const PER_PAGE = 200;

const priceChangeEmojis = {
    up: "📈",   
    down: "📉",  
    neutral: "⚖️", 
};

export const fetchAndStoreCryptoData = async () => {
    try {
        console.log("🚀 Начинаем обновление данных о криптовалютах...");

        let changedCryptos: { symbol: string, name: string, oldPrice: number, newPrice: number }[] = [];

        for (let page = 1; page <= MAX_PAGES; page++) {
            const response = await axios.get(API_URL, {
                params: {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: PER_PAGE,
                    page,
                    sparkline: false,
                },
            });

            const cryptoData = response.data;

            for (const coin of cryptoData) {
                const existingCrypto = await prisma.crypto.findUnique({
                    where: { symbol: coin.symbol.toUpperCase() },
                });

                const oldPrice = existingCrypto?.price || 0;
                const newPrice = coin.current_price;

                if (existingCrypto && oldPrice !== newPrice) {
                    changedCryptos.push({
                        symbol: coin.symbol.toUpperCase(),
                        name: coin.name,
                        oldPrice,
                        newPrice,
                    });
                    const subscriptions = await prisma.subscription.findMany({
                        where: { cryptoId: existingCrypto.id },
                    });

                    for (let subscription of subscriptions) {
                        const user = await prisma.user.findUnique({
                            where: { userId: subscription.userId.toString() }, 
                        });
                        if (user) {
                            const priceChangeType = newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : 'neutral';
                            const arrow = priceChangeEmojis[priceChangeType]; 
                            const message = `${arrow} Цена криптовалюты ${coin.name} изменилась!\nСтарая цена: ${oldPrice} \nНовая цена: ${newPrice}`;
                            await sendTelegramMessage(user.userId, message); 
                        }
                    }
                }

                await prisma.crypto.upsert({
                    where: { symbol: coin.symbol.toUpperCase() },
                    update: {
                        price: newPrice,
                        marketCap: coin.market_cap,
                        volume24h: coin.total_volume,
                    },
                    create: {
                        symbol: coin.symbol.toUpperCase(),
                        name: coin.name,
                        price: newPrice,
                        marketCap: coin.market_cap,
                        volume24h: coin.total_volume,
                    },
                });
            }
            console.log(`✅ Страница ${page} обновлена!`);
        }

        console.log("✅ Все данные обновлены!");
        return changedCryptos;
    } catch (error) {
        console.error("❌ Ошибка при обновлении данных:", error);
        return [];
    }
};

export const getChangedCryptos = async () => {
    const cryptos = await fetchAndStoreCryptoData();
    return cryptos;
};
