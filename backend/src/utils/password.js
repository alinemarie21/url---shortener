import bcrypt from 'bcrypt';
import authConfig from '../config/auth.js';

export function hashPassword(password) {
  return bcrypt.hash(password, authConfig.bcryptSaltRounds);
}

export function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
