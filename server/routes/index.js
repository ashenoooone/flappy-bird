const Router = require('express');
const router = new Router();
const ToDoRouter = require('./ToDoRouter');
const UserRouter = require('./UserRouter');
const FolderRouter = require('./FolderRouter');

router.use('/todo', ToDoRouter);
router.use('/user', UserRouter);
router.use('/folder', FolderRouter);
module.exports = router;
