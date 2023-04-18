import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/signUp', authenticateToken, signUp);

router.post('/signIn', signIn);

export default router;
