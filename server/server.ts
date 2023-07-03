import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index';
import cors from 'cors';
import errorHandler from './middleware/ErrorHandlingMiddleware';
import bodyParser from "body-parser";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', router);
app.use('/api', express.static('static'));
app.use(errorHandler);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`SUCCESS ON PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start()