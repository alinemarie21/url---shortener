import * as urlService from '../services/url.service.js';

export async function redirectToOriginalUrl(req, res) {
  const originalUrl = await urlService.registerClickAndGetOriginalUrl(
    req.params.shortCode
  );

  res.redirect(302, originalUrl);
}
