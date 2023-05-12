import { Model } from "sequelize";

export interface MUserGroup extends Model {
  userIds: string[];
  groupId: string;
}
