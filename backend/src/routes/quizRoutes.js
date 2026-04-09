import express from 'express';
import {
  getWeeklyQuiz,
  getWeeklyQuizAdmin,
  getAllQuizzes,
  createWeeklyQuiz,
  updateWeeklyQuiz,
  togglePublishQuiz,
  deleteQuiz,
  getDashboardStats
} from '../controllers/quizController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoints
router.get('/weekly', getWeeklyQuiz);

// Admin endpoints
router.get('/admin/stats', protect, admin, getDashboardStats);
router.get('/admin/weekly', protect, admin, getWeeklyQuizAdmin);
router.get('/admin/all', protect, admin, getAllQuizzes);
router.post('/admin/weekly', protect, admin, createWeeklyQuiz);
router.put('/admin/weekly/:id', protect, admin, updateWeeklyQuiz);
router.patch('/admin/weekly/:id/publish', protect, admin, togglePublishQuiz);
router.delete('/admin/weekly/:id', protect, admin, deleteQuiz);

// Fallback for old routes
router.post('/weekly', protect, admin, createWeeklyQuiz);

export default router;
