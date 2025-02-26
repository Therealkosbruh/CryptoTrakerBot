import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN as string;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

export const sendTelegramMessage = async (chatId: string, message: string) => {
    try {
        await bot.sendMessage(chatId, message);
        console.log("Message successfully sent");
    } catch (error) {
        console.error("Error during sending message", error);
    }
};
