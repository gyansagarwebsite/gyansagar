import express from 'express';
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getRecentQuestions,
  appendChunk2
} from '../controllers/questionController.js';
import {
  getTodayQuestion,
  upsertDailyQuestion,
  getAllDailyQuestions,
  deleteDailyQuestion
} from '../controllers/dailyQuestionController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Daily Question routes
router.get('/today', getTodayQuestion); // Public
router.get('/all-daily', protect, admin, getAllDailyQuestions);
router.post('/daily', protect, admin, upsertDailyQuestion);
router.delete('/daily/:id', protect, admin, deleteDailyQuestion);

// Main Question routes
router.route('/')
  .get(getQuestions)
  .post(protect, admin, createQuestion);

router.route('/recent')
    .get(protect, admin, getRecentQuestions);

router.route('/:id')
  .get(getQuestion)
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

router.post('/append-chunk2-gs-internal', appendChunk2);

export default router;
