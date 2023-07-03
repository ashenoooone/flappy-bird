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

    return res.json({user: userUpd});
  }
}

export default new SkinController()