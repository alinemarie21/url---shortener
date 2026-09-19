import * as urlRepository from '../repositories/url.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import * as clickRepository from '../repositories/click.repository.js';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../errors/http-errors.js';
import { generateShortCode } from '../utils/short-code.js';
import appConfig from '../config/app.js';

const SHORT_CODE_LENGTH = 5;
const MAX_SHORT_CODE_ATTEMPTS = 10;
const MAX_ORIGINAL_URL_LENGTH = 2048;

function isValidHttpUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function toResponse(url) {
  return {
    short_code: url.short_code,
    short_url: `${appConfig.baseUrl}/${url.short_code}`,
    original_url: url.original_url,
    created_at: url.created_at,
  };
}

async function generateUniqueShortCode() {
  for (let attempt = 0; attempt < MAX_SHORT_CODE_ATTEMPTS; attempt++) {
    const shortCode = generateShortCode(SHORT_CODE_LENGTH);

    if (!(await urlRepository.existsByShortCode(shortCode))) {
      return shortCode;
    }
  }

  throw new Error('Could not generate a unique short code');
}

export async function shorten({ originalUrl, userId }) {
  if (typeof originalUrl !== 'string' || !isValidHttpUrl(originalUrl.trim())) {
    throw new ValidationError('original_url must be a valid http or https URL');
  }
  if (originalUrl.trim().length > MAX_ORIGINAL_URL_LENGTH) {
    throw new ValidationError('Tente com um link menor');
  }

  if (!(await userRepository.findById(userId))) {
    throw new UnauthorizedError(
      'access token belongs to a user that no longer exists'
    );
  }

  const url = await urlRepository.create({
    shortCode: await generateUniqueShortCode(),
    userId,
    originalUrl: originalUrl.trim(),
  });

  return toResponse(url);
}

async function findUrlOrFail(shortCode) {
  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    throw new NotFoundError('short code not found');
  }

  return url;
}

export async function findOwnedUrlOrFail(shortCode, userId) {
  const url = await findUrlOrFail(shortCode);

  if (url.user_id !== userId) {
    throw new ForbiddenError('you do not own this short code');
  }

  return url;
}

export async function findByShortCode(shortCode) {
  return toResponse(await findUrlOrFail(shortCode));
}

export async function listByUser(userId) {
  const urls = await urlRepository.findAllByUserId(userId);

  return urls.map(toResponse);
}

export async function registerClickAndGetOriginalUrl(shortCode) {
  const url = await findUrlOrFail(shortCode);

  await clickRepository.create({ shortCode: url.short_code });

  return url.original_url;
}
