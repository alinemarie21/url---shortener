import { UnauthorizedError } from '../errors/http-errors.js';
import { verifyAccessToken } from '../utils/token.js';

export function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('access token is required');
  }

  try {
    const { userId } = verifyAccessToken(token);
    req.user = { id: userId };
  } catch {
    throw new UnauthorizedError('access token is invalid or expired');
  }

  next();
}
