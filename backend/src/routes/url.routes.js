import { Router } from 'express';
import * as urlController from '../controllers/url.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/', authenticate, urlController.create);
router.get('/:shortCode', urlController.show);

export default router;
