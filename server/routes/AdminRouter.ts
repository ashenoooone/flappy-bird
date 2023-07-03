import {Router} from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware';
import multer from "multer";
import AdminOnlyMiddleware from '../middleware/AdminOnlyMiddleware'
import AdminController from "../controllers/AdminController";

const router = Router();
const upload = multer({dest: 'static/'});


router.get('/users', AuthMiddleware, AdminOnlyMiddleware, AdminController.getUsers);
router.post('/user/balance/add', AuthMiddleware, AdminOnlyMiddleware, AdminController.addBalance);
router.post('/user/balance/sub', AuthMiddleware, AdminOnlyMiddleware, AdminController.subtractBalance);
router.post('/user/ban', AuthMiddleware, AdminOnlyMiddleware, AdminController.banUser);
router.post('/user/unban', AuthMiddleware, AdminOnlyMiddleware, AdminController.unbanUser);
router.post('/skin/add', upload.single("file"), AuthMiddleware, AdminOnlyMiddleware, AdminController.addSkin);
router.post('/skin/remove', AuthMiddleware, AdminOnlyMiddleware, AdminController.deleteSkin);

export default router;
