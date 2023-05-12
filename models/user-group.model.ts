import {User} from './user.model';
import {Group} from './group.model';
import {DataTypes} from 'sequelize';
import {sequelize} from '../data-access';
import { MUserGroup } from '../types';


export const UserGroup = sequelize.define<MUserGroup>(
  'userGroup',
  {
    userId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.STRING,
      references: {
        model: Group,
        key: 'id'
      }
    }
  },
  { freezeTableName: true, timestamps: false }
);

User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId', as: 'Users' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId', as: 'Groups' });
