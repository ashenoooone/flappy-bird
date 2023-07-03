import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import {AuthenticatedRequest} from "./AuthMiddleware";

dotenv.config();

export default function adminOnlyMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if(!user) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    if(user.role !== "ADMIN") {
      return res.status(401).json({ message: 'Ошибка доступа' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
}
