import { NextFunction, Request, Response } from "express";
import {UserService} from '../services';

const userService = new UserService();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { login, password } = req.body;

    const permissions = await userService.login(login, password);
    if (permissions) {
      return res.status(200).json(permissions);
    }

    return res.status(403).json('The access forbidden');
  } catch (error) {
    next(error);
  }
};
