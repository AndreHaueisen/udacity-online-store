import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index';
import logger from './utils/logger';

const app: express.Application = express();
const port = 3000;
const address = `0.0.0.0:${port}`;

const corsOptions = {
  origin: address,
  optionsSuccessStatus: 200
};

app.all('*', logger);
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', routes);

app.use(bodyParser.json());

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
