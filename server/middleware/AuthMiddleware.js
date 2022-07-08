const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
