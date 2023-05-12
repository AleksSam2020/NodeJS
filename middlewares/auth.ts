import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";


export const checkTokenAccess = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json('Unauthorized Error. You didn\'t provide token.');
  }

  jwt.verify(token, 'access-token-secret', (err: unknown) => {
    if (err) {
      return res.status(403).json('The access forbidden');
    }

    next();
  });
};
