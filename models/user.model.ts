import { sequelize } from "../data-access";
import { DataTypes } from "sequelize";
import { UserModel } from '../types';

export const User = sequelize.define<UserModel>(
  'Users',
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },

    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'true',
        msg: 'login has already exist'
      },
      validate: {
        isAlphanumeric: true,

      },

    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: new RegExp(/^[A-Za-z]+\d+.*$/)
      }
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 4,
        max: 130
      }
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  { freezeTableName: true, timestamps: false }
);
