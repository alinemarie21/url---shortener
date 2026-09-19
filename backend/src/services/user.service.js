import * as userRepository from '../repositories/user.repository.js';
import { ConflictError, ValidationError } from '../errors/http-errors.js';
import { hashPassword } from '../utils/password.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isFilledString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
}

export async function create({ name, email, password }) {
  if (!isFilledString(name)) {
    throw new ValidationError('name is required');
  }
  if (!isFilledString(email) || !EMAIL_PATTERN.test(email.trim())) {
    throw new ValidationError('email must be a valid email address');
  }
  if (!isFilledString(password)) {
    throw new ValidationError('password is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await userRepository.findByEmail(normalizedEmail)) {
    throw new ConflictError('email is already registered');
  }

  const user = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await hashPassword(password),
  });

  return toResponse(user);
}
