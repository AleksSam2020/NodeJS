import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface IUser  {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export interface UserModel
  extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}
