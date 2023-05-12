import {logger} from '../loggers';
import {NextFunction, Request, Response} from "express";

export const errorMethods = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(
    `Method: ${req.method}; Arguments: ${JSON.stringify(req.body)}; Error: ${err.message}`
  );
  res.status(500).send("Internal Server Error");
};
