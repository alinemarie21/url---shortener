import { Router } from 'express';
import * as urlController from '../controllers/url.controller.js';
import * as statsController from '../controllers/stats.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/', authenticate, urlController.create);
router.get('/', authenticate, urlController.listByUser);
router.get('/:shortCode', urlController.show);
router.get('/:shortCode/stats', authenticate, statsController.show);

export default router;
