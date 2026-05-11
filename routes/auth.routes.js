import { Router } from 'express';
import { register, login } from '../controllers/auth.controllers.js';
import userMiddelware from '../middleware/users.js'

const router = Router();

router.post('/register', userMiddelware.validateRegister, register);

router.post('/login', login);

export default router;