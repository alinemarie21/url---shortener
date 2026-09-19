import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

const ALGORITHM = 'HS256';

export function signAccessToken(userId) {
  return jwt.sign({}, authConfig.jwtSecret, {
    algorithm: ALGORITHM,
    subject: String(userId),
    expiresIn: authConfig.accessTokenExpiresInSeconds,
  });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, authConfig.jwtSecret, {
    algorithms: [ALGORITHM],
  });

  return { userId: Number(payload.sub) };
}
