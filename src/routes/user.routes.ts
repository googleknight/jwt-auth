import { Router } from 'express';
import { getUsers, loginUser } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { Roles } from '../types';

const router: Router = Router();

router.get('/users', [authenticate, authorize([Roles.ADMIN])], getUsers);

router.post('/login', loginUser);

export default router;
