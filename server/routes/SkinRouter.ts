import {Router} from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware';
import SkinController from "../controllers/SkinController";

const router = Router();


router.get('/', SkinController.getSkins);
router.post('/buy', AuthMiddleware, SkinController.buySkin);

export default router;
