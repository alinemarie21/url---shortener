import { HttpError } from '../errors/http-errors.js';

export function errorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    if (error.statusCode === 401) {
      res.set('WWW-Authenticate', 'Bearer');
    }
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'resource already exists' });
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
