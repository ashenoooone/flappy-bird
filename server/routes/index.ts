import { Router } from 'express';
import UserRouter from './UserRouter';
import SkinRouter from "./SkinRouter";
import AdminRouter from "./AdminRouter";

const router = Router();

router.use('/user', UserRouter);
router.use('/skin', SkinRouter);
router.use('/admin', AdminRouter);

export default router;
