import * as clickRepository from '../repositories/click.repository.js';
import * as urlService from './url.service.js';
import { startOfDay, startOfMonth, startOfWeek } from '../utils/dates.js';

export async function getUrlStats({ shortCode, userId }) {
  const url = await urlService.findOwnedUrlOrFail(shortCode, userId);

  const now = new Date();
  const counts = await clickRepository.countByPeriods({
    shortCode: url.short_code,
    todayStart: startOfDay(now),
    weekStart: startOfWeek(now),
    monthStart: startOfMonth(now),
  });

  return {
    short_code: url.short_code,
    total_clicks: counts.total,
    clicks_today: counts.today,
    clicks_this_week: counts.week,
    clicks_this_month: counts.month,
  };
}
