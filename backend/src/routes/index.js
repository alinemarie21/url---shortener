import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import urlRoutes from './url.routes.js';
import redirectRoutes from './redirect.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/urls', urlRoutes);
router.use('/', redirectRoutes);

export default router;
