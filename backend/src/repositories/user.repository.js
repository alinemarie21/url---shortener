import { User } from '../models/index.js';

export function create({ name, email, password }) {
  return User.create({ name, email, password });
}

export function findById(id) {
  return User.findByPk(id);
}

export function findByEmail(email) {
  return User.findOne({ where: { email } });
}
