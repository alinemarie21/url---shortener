import { Sequelize } from 'sequelize';
import defineUser from './user.js';
import defineUrl from './url.js';
import defineClick from './click.js';
import databaseConfig from '../config/database.js';

export const sequelize = new Sequelize(databaseConfig.development);

export const User = defineUser(sequelize);
export const Url = defineUrl(sequelize);
export const Click = defineClick(sequelize);

const models = { User, Url, Click };

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});
