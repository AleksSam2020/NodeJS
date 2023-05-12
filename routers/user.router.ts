import express from 'express';
import { createValidator } from "express-joi-validation";
import { UsersSchema } from '../schemas';
import { createUser, deleteUserSoft, getUserById, getUsers, updateUser } from '../controllers';

export const UserRouter = express.Router();

const validator = createValidator();

UserRouter.get('/users', getUsers);
UserRouter.get('/users/:id', getUserById);
UserRouter.post('/users',validator.body(UsersSchema), createUser);
UserRouter.put('/users/:id',validator.body(UsersSchema), updateUser);
UserRouter.delete('/users/:id', deleteUserSoft);
