import { logger } from '../loggers';
import { NextFunction, Request, Response } from 'express';

export const apiLogger = (req: Request, res: Response, next: NextFunction): void => {
  const log = `Method: [${req.method}] Url: [${req.url}] Params: [${JSON.stringify(req.body)}]`;

  logger.info(log);
  next();
};
