import { sequelize } from './data-access';
import { User } from './models';
import { users } from './users';

(async () => {
  try {
    await Promise.all([sequelize.authenticate(), User.sync({ force: true })]);
    console.log('connected')

    return User.bulkCreate(users);
  } catch (error) {
    console.log( error);
  }
})();
