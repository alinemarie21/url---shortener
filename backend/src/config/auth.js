if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

export default {
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  accessTokenExpiresInSeconds: 60 * 60,
  bcryptSaltRounds: 10,
};
