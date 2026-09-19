import { Router } from 'express';
import userRoutes from './user.routes.js';
import urlRoutes from './url.routes.js';
import redirectRoutes from './redirect.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/urls', urlRoutes);
router.use('/', redirectRoutes);

export default router;
