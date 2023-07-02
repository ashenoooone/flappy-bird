import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";
import ApiError from '../error/ApiError';
import dotenv from 'dotenv';
import {AuthenticatedRequest} from "../middleware/AuthMiddleware";

dotenv.config();

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    let {email, username, password} = req.body;
    if (!email || !password || !username) {
      return next(ApiError.badRequest('Неправильно задана почта или пароль.'));
    }
    const prisma = new PrismaClient();
    let candidate = await prisma.user.findUnique({where: {email}});
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь с такой почтой уже существует.')
      );
    }
    candidate = await prisma.user.findFirst({where: {username}});
    if (candidate) {
      return next(
        ApiError.badRequest(
          'Пользователь с таким именем пользователя уже существует.'
        )
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = prisma.user.create({
      data: {
        email,
        password: hashPassword,
        username,
        createdAt: new Date(),
        settings: {
          create: {
            selectedSkinId: 1,
          }
        },
        leaderboardScores: {
          create: {
            score: 0,
            createdAt: new Date(),
          }
        }
      }
    })
    await prisma.$disconnect()
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
      return next(
        ApiError.badRequest('Пользователя с такой почтой не существует.')
      );
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest('Неправильный пароль.'));
    }
    const token = jsonwebtoken.sign(
      {
        email: user.email,
      },
      process.env.SECRET_KEY as string,
      {
        expiresIn: '168h',
      }
    );
    const score = await prisma.leaderboardScore.findFirst({where: {userId: user.id}});
    await prisma.$disconnect()
    return res.json({
      token,
      username: user.username,
      email: user.email,
      score
    });
  }

  async check(req: AuthenticatedRequest, res: Response) {
    const prisma = new PrismaClient();
    const user = prisma.user.findUnique({where: {email: req.user?.email}});
    await prisma.$disconnect()
    return res.json(user);
  }

  async getLeaders(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      take: 5,
      include: {
        leaderboardScores: {
          orderBy: {
            score: 'desc'
          }
        }
      }
    });
    await prisma.$disconnect()
    return res.json(users);
  }

  // функция для обновления юзернейма пользователя

  async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const {score, username} = req.body;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({where: {email: req.user?.email}});
    if (!user) {
      return next(ApiError.badRequest('Пользователя с такой почтой не существует.'));
    }
    if (score) {
      await prisma.leaderboardScore.update({
        where: {
          userId: user.id,
        }, data: {
          score: +score,
        }
      })
    }
    if (username) {
      await prisma.user.update({
        where: {
          email: user.email
        },
        data: {
          username
        }
      })
    }
    await prisma.$disconnect()
    return res.status(200).send({message: 'Данные успешно обновлены'});
  }
}

export default new UserController();
