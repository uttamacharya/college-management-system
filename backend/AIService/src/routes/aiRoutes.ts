import { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js'; // Aapke auth file ka exact path
import { handleAskAI } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Jab bhi koi POST /ask par aayega, pehle isAuth chalega, phir handleAskAI
router.post(
    '/ask',
    aiLimiter,
    isAuth,
    handleAskAI
);

export default router;