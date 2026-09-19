import * as statsService from '../services/stats.service.js';

export async function show(req, res) {
  const stats = await statsService.getUrlStats({
    shortCode: req.params.shortCode,
    userId: req.user.id,
  });

  res.json(stats);
}
