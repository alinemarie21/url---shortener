import { QueryTypes } from 'sequelize';
import { Click, sequelize } from '../models/index.js';

export function create({ shortCode }) {
  return Click.create({ short_code: shortCode });
}

export async function countByPeriods({
  shortCode,
  todayStart,
  weekStart,
  monthStart,
}) {
  const [counts] = await sequelize.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE clicked_at >= :todayStart)::int AS today,
       COUNT(*) FILTER (WHERE clicked_at >= :weekStart)::int AS week,
       COUNT(*) FILTER (WHERE clicked_at >= :monthStart)::int AS month
     FROM clicks
     WHERE short_code = :shortCode`,
    {
      replacements: { shortCode, todayStart, weekStart, monthStart },
      type: QueryTypes.SELECT,
    }
  );

  return counts;
}
