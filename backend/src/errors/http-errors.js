export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends HttpError {
  constructor(message) {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message) {
    super(409, message);
  }
}
