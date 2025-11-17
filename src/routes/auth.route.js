import express from 'express';
import { register, login, cookieOptions } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions);
    return res.json({ message: "Logged out successfully" });
});

export default router;