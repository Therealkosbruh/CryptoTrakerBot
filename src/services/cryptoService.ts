import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const MAX_PAGES = 5; 
const PER_PAGE = 200;

export const fetchAndStoreCryptoData = async () => {
  try {
    console.log("🔄 Начинаем загрузку данных о криптовалютах...");

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
        await prisma.crypto.upsert({
          where: { symbol: coin.symbol.toUpperCase() },
          update: {
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
          },
          create: {
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
          },
        });
      }
      console.log(`✅ Страница ${page} загружена!`);
    }
    console.log("🚀 Все данные о криптовалютах загружены!");
  } catch (error) {
    console.error("❌ Ошибка при загрузке данных:", error);
  }
};
