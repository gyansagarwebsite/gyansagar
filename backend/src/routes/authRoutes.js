import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes (require authentication)
router.get('/profile', protect, getAdminProfile);

// Super-admin only routes
router.post('/create', createAdmin); // Temp public for bootstrap
router.put('/:id', protect, admin, updateAdmin);
router.delete('/:id', protect, admin, deleteAdmin);

export default router;
