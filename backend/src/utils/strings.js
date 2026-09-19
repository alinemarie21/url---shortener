export function isFilledString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
