import * as urlService from '../services/url.service.js';

export async function create(req, res) {
  const { original_url: originalUrl, user_id: userId } = req.body ?? {};

  const url = await urlService.shorten({ originalUrl, userId });

  res.status(201).location(`/urls/${url.short_code}`).json(url);
}

export async function show(req, res) {
  const url = await urlService.findByShortCode(req.params.shortCode);

  res.json(url);
}
