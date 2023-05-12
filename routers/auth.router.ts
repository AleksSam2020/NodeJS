import express from 'express';
import { login } from '../controllers';
export const AuthRouter = express.Router();


AuthRouter.post('/login', login);

