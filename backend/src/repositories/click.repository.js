import { Click } from '../models/index.js';

export function create({ shortCode }) {
  return Click.create({ short_code: shortCode });
}
