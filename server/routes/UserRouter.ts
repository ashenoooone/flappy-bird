import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthMiddleware from '../middleware/AuthMiddleware';

const router = Router();

router.post('/registration', UserController.register);
router.post('/login', UserController.login);
router.get('/auth', AuthMiddleware, UserController.check);
router.get('/leaders', UserController.getLeaders);
router.post('/', AuthMiddleware, UserController.updateUser);

export default router;
