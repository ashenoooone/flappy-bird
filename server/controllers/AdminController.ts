import {Response, NextFunction} from 'express';
import {PrismaClient, UserRole} from "@prisma/client";
import dotenv from 'dotenv';
import {config} from "../config/config";
import {AuthenticatedRequest} from "../middleware/AuthMiddleware";
import * as fs from "fs";
import path from "path";

dotenv.config();

class SkinController {
  async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      include: {
        leaderboardScores: true,
        settings: true
      }
    });
    await prisma.$disconnect()
    return res.json({users});
  }

  async addBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {userId, add} = req.body
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    const userUpd = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        coins: user.coins + Number(add)
      }
    })
    await prisma.$disconnect()
    return res.json({userUpd});
  }

  async subtractBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {userId, sub} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    const userUpd = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        coins: user.coins - Number(sub)
      }
    })
    await prisma.$disconnect()
    return res.json({userUpd});
  }

  async banUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {userId} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    if (user.userRole === UserRole.ADMIN) {
      return res.status(401).json({message: "Невозможно заблокировать администратора"})
    }
    const userUpd = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isBanned: true
      }
    })

    await prisma.$disconnect()
    return res.json({user: userUpd});
  }

  async unbanUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {userId} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    const userUpd = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isBanned: false
      }
    })

    await prisma.$disconnect()
    return res.json({user: userUpd});
  }

  async addSkin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {name, price} = req.body
    const file = req.file
    if (!req.user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    if (!name || !price) {
      return res.status(400).json("Не все поля заполнены")
    }
    if (!file) {
      return res.status(400).json({message: "Файл не найден"})
    }
    let newPath = `${config.paths.static}\\${name}.${file?.originalname.split(".")[1]}`;
    if (fs.existsSync(newPath)) {
      return res.status(400).json({message: "Скин с таким названием уже существует"})
    }
    fs.rename(file.path, newPath, (err) => {
      if (err) throw err;
    });
    const skin = await prisma.skin.create({
      data: {
        name,
        imageURL: `/${name}.${file?.originalname.split(".")[1]}`,
        cost: +price,
        userSettings: {
          connect: {
            userId: 1
          }
        }
      }
    })
    await prisma.$disconnect()
    return res.json(skin);
  }

  async deleteSkin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {skinId} = req.body
    if (+skinId === 1) {
      return res.status(400).json("Нельзя удалить стандартный скин")
    }
    if (!req.user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }


    const skin = await prisma.skin.findUnique({where: {id: skinId}});

    if (skin) {
      const imagePath = path.join(config.paths.static, skin.imageURL);
      fs.unlinkSync(imagePath);
    }

    await prisma.userSettings.updateMany({
      where: {selectedSkinId: +skinId},
      data: {selectedSkinId: 1},
    });

    await prisma.skin.delete({
      where: {id: skinId},
    });

    const userSettings = await prisma.userSettings.findMany({
      where: {
        skins: {some: {id: skinId}}
      }
    })


    userSettings.map(async (item) => {
      await prisma.userSettings.update({
        where: {
          id: item.id
        },
        data: {
          skins: {
            disconnect: {
              id: +skinId
            }
          }
        }
      })
    })

    await prisma.$disconnect()
    return res.status(200).json(skinId);
  }
}

export default new SkinController()