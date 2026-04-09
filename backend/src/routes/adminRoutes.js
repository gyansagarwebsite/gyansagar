import express from 'express';
import { getDashboardStats } from '../controllers/adminDashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard metrics
 * @access  Private/Admin
 */
router.get('/stats', protect, admin, getDashboardStats);

export default router;
