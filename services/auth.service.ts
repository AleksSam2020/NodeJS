import jwt from "jsonwebtoken";
import {IAuth} from '../types';

export class AuthService {
  createAccessToken = (payload: IAuth) => {
    return jwt.sign(payload, 'access-token-secret', { expiresIn: "60s" });
  };
}
