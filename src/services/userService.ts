import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService{
    async findUserByUserId(userId: string){
        return await prisma.user.findUnique({
            where: {userId},
        });
    }

    async createUser(userId: string, chatId: string, userNickname: string) {
        return await prisma.user.create({
          data: {
            userId,
            chatId,
            userNickname,
          },
        });
    }
}