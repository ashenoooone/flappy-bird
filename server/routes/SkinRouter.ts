import {Router} from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware';
import SkinController from "../controllers/SkinController";
import multer from "multer";

const router = Router();
const upload = multer({dest: 'static/'});


router.get('/', SkinController.getSkins);
router.post('/', upload.single("file"), AuthMiddleware, SkinController.addSkin);
router.post('/buy', upload.single("file"), AuthMiddleware, SkinController.buySkin);

export default router;
