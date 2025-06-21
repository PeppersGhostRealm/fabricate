import { Router } from 'express';
import { discordLogin, discordCallback, getMe } from '../controllers/auth.controller';

const router = Router();

// Redirect user to Discord OAuth2 authorization endpoint
router.get('/discord', discordLogin);

// Handle Discord callback, exchange code, issue JWT, set cookie, and redirect to frontend
router.get('/discord/callback', discordCallback);

// Return current user info based on JWT in httpOnly cookie
router.get('/me', getMe);

export default router;