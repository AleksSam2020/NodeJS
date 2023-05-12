import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';
export interface IGroup {
  id:string;
  name: string;
  permissions: Array<Permission>;
}

export interface GroupModel
  extends Model<InferAttributes<GroupModel>, InferCreationAttributes<GroupModel>> {
  id: string;
  name: string;
  permissions: Array<Permission>;
}
