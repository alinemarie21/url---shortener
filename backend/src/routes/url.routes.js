import { Router } from 'express';
import * as urlController from '../controllers/url.controller.js';

const router = Router();

router.post('/', urlController.create);
router.get('/:shortCode', urlController.show);

export default router;
