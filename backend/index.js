import express from 'express';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/error-handler.js';
import appConfig from './src/config/app.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(routes);
app.use(errorHandler);

app.listen(appConfig.port, () => {
  console.log(`Example app listening on port ${appConfig.port}`);
});
