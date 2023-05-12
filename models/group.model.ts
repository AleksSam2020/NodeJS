import { sequelize } from "../data-access";
import { DataTypes } from "sequelize";
import { GroupModel } from '../types';


export const Group = sequelize.define<GroupModel>(
  'Groups',
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'true',
        msg: 'name has already exist'
      },
    },

    permissions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false
    }
  },
  { freezeTableName: true, timestamps: false }
);
