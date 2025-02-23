import { UserService } from "../services/userService";

const userService = new UserService();

export const handleUserStart = async (userId: string, chatId: string, userNickname: string) => {
  const existingUser = await userService.findUserByUserId(userId);

  if (!existingUser) {
    await userService.createUser(userId, chatId, userNickname);
    console.log(`Пользователь с ID ${userId} создан в базе данных.`);
  } else {
    console.log(`Пользователь с ID ${userId} уже существует в базе данных.`);
  }
};
