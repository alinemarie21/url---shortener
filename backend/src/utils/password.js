import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = await scryptAsync(password, salt, KEY_LENGTH);

  return `${salt}:${hash.toString('hex')}`;
}
