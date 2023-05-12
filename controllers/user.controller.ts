import { v4 as uuidv } from 'uuid';
import {NextFunction, Request, Response} from 'express';
import { UserService } from '../services';

const userService = new UserService();
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  user ? res.send(user) : res.status(404).json('Not Found')
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { loginSubstring, limit } = req.query;

  try {
    if(loginSubstring || limit) {

      const users = await userService.getAutoSuggestUsers(
        loginSubstring ? String(loginSubstring): '',
        limit ? Number(limit) : undefined
      );

      return res.json(users);
    } else {
      const users = await userService.getAllUsers();
      return res.json(users)
    }

  } catch (error ) {
    next(error);
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user  = {
    ...req.body,
    id: uuidv(),
    isDeleted: false
  };

    await userService.createUser(user);
    res.status(201).json(user)

  } catch (error) {
    next(error);
  }
};
export const updateUser  = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);
  if(!user) return res.status(404).json('User doesn\'t exist');

  try {
    await userService.updateUser(user.id, req.body);
    res.status(200).json('User has successfully updated')
  } catch (error ) {
    next(error);
  }
}

export const deleteUserSoft = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if(!user) return res.status(404).json('User doesn\'t exist');
  if(user?.isDeleted) return res.status(400).json('User has been already deleted');

  try {
    await userService.deleteUser(user.id);
  } catch (error) {
    next(error);
  }

  res.status(201).json('User has successfully deleted')
}
