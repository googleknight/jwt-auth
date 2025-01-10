import { Router } from 'express';
import { getUsers } from '../controllers';

const router: Router = Router();

router.get('/users', getUsers);

export default router;
