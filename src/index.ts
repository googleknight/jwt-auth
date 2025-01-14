import express, { Application } from 'express';
import routes from './routes';
import { requestLogger, errorHandler } from './middlewares';
import { logger } from './utils/logger';
import config from './config';
const app: Application = express();

app.use(express.json());

// Apply middleware
app.use(requestLogger);

// Use aggregated routes
app.use(`/${config.prefix}`, routes);
app.use(errorHandler as express.ErrorRequestHandler);

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
