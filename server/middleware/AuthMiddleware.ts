import {NextFunction, Request, Response} from 'express';
import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface User {
  email:string;
  role: string;
  [key:string]:string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export default function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    const secretKey: Secret = process.env.SECRET_KEY || '';
    req.user = jwt.verify(token, secretKey) as User;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
}
