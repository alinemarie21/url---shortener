import { Sequelize } from 'sequelize';
import defineUser from './user.js';
import defineUrl from './url.js';
import defineClick from './click.js';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'urlshortener',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '111111',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export const User = defineUser(sequelize);
export const Url = defineUrl(sequelize);
export const Click = defineClick(sequelize);

const models = { User, Url, Click };

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});
