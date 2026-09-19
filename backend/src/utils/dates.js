export function startOfDay(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function startOfWeek(date) {
  const start = startOfDay(date);
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

export function startOfMonth(date) {
  const start = startOfDay(date);
  start.setDate(1);
  return start;
}
