const development = {
  database: process.env.DB_NAME || 'urlshortener',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '111111',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
};

export default { development };
