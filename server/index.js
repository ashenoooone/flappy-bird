const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const sequelize = require('./db');
const router = require('./routes/index');
const cors = require('cors');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.use('/api', router);
// обработка ошибок
app.use(errorHandler);

(async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`SUCCES ON PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
