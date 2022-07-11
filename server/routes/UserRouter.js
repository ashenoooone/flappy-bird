const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/registration', UserController.register);
router.post('/login', UserController.login);
router.get('/auth', AuthMiddleware, UserController.check);
router.get('/leaders', UserController.getLeaders);

module.exports = router;
