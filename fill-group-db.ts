import { sequelize } from './data-access';
import { Group } from './models';
import { groups } from './groups';

(async () => {
  try {
    await Promise.all([sequelize.authenticate(), Group.sync({ force: true })]);
    console.log('connected')

    return Group.bulkCreate(groups);
  } catch (error) {
    console.log( error);
  }
})();
