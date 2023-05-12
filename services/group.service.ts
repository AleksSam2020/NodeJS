import { IGroup } from '../types';
import { Group, UserGroup} from '../models';
import { sequelize } from '../data-access';

export class GroupService {
  getAllGroups = async () => {
    return Group.findAll();
  };

  getGroupById = async (id: string) => {
    return Group.findByPk(id);
  };
  createGroup = async (groupData: IGroup) => {
    // @ts-ignore
    return Group.create(groupData);
  };

  updateGroup = async (id: string, group: IGroup) => {
    return Group.update({ ...group }, { where: { id } });
  };

  deleteGroup = async (id: string) => {
    return Group.destroy({ where: { id } });
  };

  addUsersToGroup = async (groupId: string, userIds: string[]) =>
    sequelize.transaction(async (transaction) => {
      for (const userId of userIds) {
        await UserGroup.create({ userId, groupId }, { transaction });
      }
    });
}
