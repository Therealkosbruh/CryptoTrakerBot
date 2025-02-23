import * as dotenv from "dotenv";
import TelegramBot, { Message } from "node-telegram-bot-api";
import { handleUserStart } from "./constollers/userController";

dotenv.config();

const token = process.env.BOT_TOKEN; 

if (!token) {
  console.error("BOT_TOKEN не найден!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });


const createMenu = () => {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "🧑 Профиль" }, { text: "📊 Подписки" }],
        [{ text: "🗒 Команды" }, { text: "❗️Info" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };
};

bot.onText(/\/start/, async (msg: Message) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || ""; 
  const userNickname = msg.from?.first_name || "Пользователь";

  await handleUserStart(userId, chatId.toString(), userNickname);

  const welcomeMessage = `Привет, ${userNickname}! 👋\nЯ твой персональный помощник для отслеживания статистики криптовалют. 🚀\nЯ помогу тебе следить за курсами, изменениями цен и последними новостями выбранной тобой криптовалюты. Просто выбери интересующую тебя монету, и я покажу все актуальные данные! 📈 Для изучения моей работы перейди в раздел "Info".`;
  bot.sendMessage(chatId, welcomeMessage, createMenu());
});
