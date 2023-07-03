import {Response, NextFunction} from 'express';
import {PrismaClient} from "@prisma/client";
import dotenv from 'dotenv';
import {config} from "../config/config";
import {AuthenticatedRequest} from "../middleware/AuthMiddleware";
import * as fs from "fs";
import path from "path";

dotenv.config();

class SkinController {
  async getSkins(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const skins = await prisma.skin.findMany();
    return res.json(skins);
  }

  async buySkin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const {skinId} = req.body
    if (!req.user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    const user = await prisma.user.findUnique({where: {email: req.user.email}})
    if (!user) {
      return res.status(400).json({message: "Пользователь не найден"})
    }
    const skin = await prisma.skin.findUnique({where: {id: +skinId}})
    if (!skin) {
      return res.status(400).json({message: "Скин не найден"})
    }

    if (!skin.cost) {
      return res.status(400).json({message: "Скин не продается"})
    }

    if (user.coins < skin.cost) {
      return res.status(400).json({message: "Недостаточно монет"})
    }

    await prisma.user.update({
      where: {
        email: req.user.email
      },
      data: {
        coins: user.coins - skin.cost,
      }
    })

    await prisma.userSettings.update({
      where: {
        userId: +user.id
      },
      data: {
        skins: {
          connect: {
            id: skin.id
          }
        }
      }
    })
    return res.status(200).json(skin);
  }
}

export default new SkinController()