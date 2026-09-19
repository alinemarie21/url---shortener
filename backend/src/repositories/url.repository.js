import { Url } from '../models/index.js';

export function create({ shortCode, userId, originalUrl }) {
  return Url.create({
    short_code: shortCode,
    user_id: userId,
    original_url: originalUrl,
  });
}

export function findByShortCode(shortCode) {
  return Url.findByPk(shortCode);
}

export async function existsByShortCode(shortCode) {
  const count = await Url.count({ where: { short_code: shortCode } });
  return count > 0;
}
