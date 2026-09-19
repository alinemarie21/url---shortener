import { Router } from 'express';
import * as redirectController from '../controllers/redirect.controller.js';

const router = Router();

router.get('/:shortCode', redirectController.redirectToOriginalUrl);

export default router;
