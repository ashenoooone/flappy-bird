import {NextFunction, Request, Response} from 'express';
import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: { [key: string]: any };
}

export default function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    const secretKey: Secret = process.env.SECRET_KEY || ''; // Указать нужный тип или значение по умолчанию
    req.user = jwt.verify(token, secretKey) as { [key: string]: any };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
}
