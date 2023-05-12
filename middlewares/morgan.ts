import morgan, { StreamOptions } from "morgan";
import { logger } from '../loggers';

const stream: StreamOptions = {
  write: (message: string) => logger.http(message)
};

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);
