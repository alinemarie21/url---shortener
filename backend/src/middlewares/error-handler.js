import { HttpError } from '../errors/http-errors.js';

export function errorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
