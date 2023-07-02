import express from 'express';
import dotenv from 'dotenv';
import {Sequelize} from 'sequelize';
import router from './routes/index';
import cors from 'cors';
import errorHandler from './middleware/ErrorHandlingMiddleware';

dotenv.config();
const PORT = process.env.PORT || 3000;
const sequelize = new Sequelize(/* настройки подключения к базе данных */);
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`SUCCESS ON PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start()