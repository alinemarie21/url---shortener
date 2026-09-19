import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateShortCode(length) {
  let shortCode = '';

  for (let i = 0; i < length; i++) {
    shortCode += ALPHABET[randomInt(ALPHABET.length)];
  }

  return shortCode;
}
