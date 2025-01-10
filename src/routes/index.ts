import { Router } from 'express';
import userRoutes from './user.routes';

const router: Router = Router();

// Use user routes
router.use(userRoutes);

export default router;
