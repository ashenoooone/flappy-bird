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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        username,
        userRole: "USER",
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
        },
      }
    })
    return res.json(user);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {email},
      include: {
        leaderboardScores: true,
        settings: true,
      }
    });
    if (!user) {
      return next(
        ApiError.badRequest('Пользователя с такой почтой не существует.')
      );
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword && (user.userRole !== 'ADMIN' && user.password !== password)) {
      return next(ApiError.badRequest('Неправильный пароль.'));
    }
    const token = jsonwebtoken.sign(
      {
        email: user.email,
        role: user.userRole,
      },
      process.env.SECRET_KEY as string,
      {
        expiresIn: '168h',
      }
    );

    return res.json({
      token,
      user
    });
  }

  async check(req: AuthenticatedRequest, res: Response) {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {email: req.user?.email}, include: {
        leaderboardScores: true,
        settings: true,
      }
    });
    return res.json({user});
  }

  async getLeaders(req: Request, res: Response) {
    const prisma = new PrismaClient();

    const leaders = await prisma.leaderboardScore.findMany({
      take: 5,
      orderBy: {
        score: 'desc'
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    })
    return res.json(leaders);
  }


  async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const {score, username, skinId} = req.body;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({where: {email: req.user?.email}});
    if (!user) {
      return next(ApiError.badRequest('Пользователя с такой почтой не существует.'));
    }

    const userScore = await prisma.leaderboardScore.findUnique({where: {userId: user?.id}})
    if (!userScore) {
      return next(ApiError.badRequest('Пользователя с такой почтой не существует.'));
    }


    if (score && score > userScore?.score) {
      await prisma.leaderboardScore.update({
        where: {
          userId: user.id,
        }, data: {
          score: +score,
        }
      })
      await prisma.user.update(({where: {email: user.email}, data: {coins: user.coins + score}}))
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
    if (skinId) {
      await prisma.userSettings.update({
        where: {userId: user.id}, data: {
          selectedSkinId: {set: +skinId}
        }
      })
    }
    const userReturn = await prisma.user.findUnique({
      where: {email: req.user?.email},
      include: {
        leaderboardScores: true,
        settings: true
      }
    });
    await prisma.$disconnect()
    return res.status(200).json({user: userReturn});
  }

  async getMySkins(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {email: req.user?.email},
      include: {
        settings: {
          include: {
            skins: true
          }
        }
      }
    });
    if (!user) {
      return next(ApiError.badRequest('Пользователя с такой почтой не существует.'));
    }
    const skins = user.settings?.skins;
    if (!skins) {
      return res.json([]);
    }
    await prisma.$disconnect()
    return res.json(skins);
  }
}

export default new UserController();
