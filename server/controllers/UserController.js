const { User } = require('../models/model');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const db = require('../db');
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
    const user = await User.create({
      email,
      password: hashPassword,
      username,
      score: 0,
    });
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
      {
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '168h',
      }
    );
    return res.json({
      token,
      username: user.username,
      email: user.email,
      score: user.score,
    });
  }

  async check(req, res) {
    const user = await User.findOne({ where: { email: req.user.email } });
    return res.json(user);
  }

  async getLeaders(req, res) {
    const query = `SELECT id, email, username, password, score, "createdAt", "updatedAt" FROM public.users ORDER BY score DESC limit 5;`;
    const users = await db.query(query);
    return res.json(users);
  }

  async updateScore(req, res) {
    const { score, username } = req.body;
    if (score) {
      await User.update(
        { score: +score },
        { where: { email: req.user.email } }
      );
    } else if (username) {
      await User.update(
        { username: username },
        { where: { email: req.user.email } }
      );
    }
    return res.status(200).send({ message: 'Данные успешно обновлены' });
  }
}

module.exports = new UserController();
