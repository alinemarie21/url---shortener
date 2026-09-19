import * as userRepository from '../repositories/user.repository.js';
import { UnauthorizedError, ValidationError } from '../errors/http-errors.js';
import { comparePassword } from '../utils/password.js';
import { signAccessToken } from '../utils/token.js';
import { isFilledString, normalizeEmail } from '../utils/strings.js';
import authConfig from '../config/auth.js';

export function createTokenResponse(userId) {
  return {
    access_token: signAccessToken(userId),
    token_type: 'Bearer',
    expires_in: authConfig.accessTokenExpiresInSeconds,
  };
}

export async function login({ email, password }) {
  if (!isFilledString(email) || !isFilledString(password)) {
    throw new ValidationError('email and password are required');
  }

  const user = await userRepository.findByEmail(normalizeEmail(email));
  const passwordMatches =
    user && (await comparePassword(password, user.password));

  if (!passwordMatches) {
    throw new UnauthorizedError('invalid email or password');
  }

  return createTokenResponse(user.id);
}
