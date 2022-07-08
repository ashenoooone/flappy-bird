const { User, Folder } = require('../models/model');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
require('dotenv').config();

class UserController {
  async register(req, res, next) {
    let { email, username, password } = req.body;
    if (!email || !password || !username) {
      return next(ApiError.badRequest('Неправильно задана почта или пароль.'));
    }
    let candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь с такой почтой уже существует.')
      );
    }
    candidate = await User.findOne({ where: { username } });
    if (candidate) {
      return next(
        ApiError.badRequest(
          'Пользователь с таким именем пользователя уже существует.'
        )
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, password: hashPassword });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(
        ApiError.badRequest('Пользователя с такой почтой не существует.')
      );
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest('Неправильный пароль.'));
    }
    const token = jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      }
    );
    return res.json({ token });
  }

  async check(req, res) {
    return res.json(req.user);
  }
}

module.exports = new UserController();
