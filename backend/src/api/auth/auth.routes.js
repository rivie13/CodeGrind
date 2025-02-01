import express from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { authService } from './auth.service.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user.userId);
    res.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updatedProfile = await authService.updateProfile(req.user.userId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router; 