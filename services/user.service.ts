import { IUser } from '../types';
import { User } from '../models';
import { Op } from "sequelize";
import {AuthService} from './auth.service';

const authService = new AuthService();
export class UserService {
  getAllUsers = async () => {
    return User.findAll({
      where: { isDeleted: false }
    });
  };

  getAutoSuggestUsers = async (loginSubstring?: string, limit?: number) => {
    return User.findAll({
      where: { login: { [Op.iLike]: `%${loginSubstring}%` }, isDeleted: false },
      order: [['login', 'ASC']],
      limit
    });
  };
  getUserById = async (id: string) => {
    return User.findByPk(id);
  };
  createUser = async (userData: IUser) => {
    return User.create(userData);
  };

  updateUser = async (id: string, user: IUser) => {
    return User.update({ ...user }, { where: { id } });
  };

  deleteUser = async (id: string) => {
    return User.update({ isDeleted: true }, { where: { id } });
  };

  login = async (login: string, password: string) => {
    const user = await User.findOne({
      where: { login, password }
    });

    if (user) {
      return {
        "access-token": authService.createAccessToken({
          id: user.id,
          login: user.login
        })
      };
    }

    return null;
  };
}
