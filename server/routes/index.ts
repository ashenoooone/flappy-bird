import { Router } from 'express';
import UserRouter from './UserRouter';
import SkinRouter from "./SkinRouter";

const router = Router();

router.use('/user', UserRouter);
router.use('/skin', SkinRouter);

export default router;
