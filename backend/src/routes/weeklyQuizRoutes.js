import express from 'express';
import {
  adminWeeklyQuizCurrent,
  adminWeeklyQuizSave,
  adminWeeklyQuizReset,
  toggleWeeklyQuizActive,
  publicWeeklyQuizStatus,
  publicWeeklyQuizStart,
  publicWeeklyQuizCurrent,
  publicWeeklyQuizSubmit,
  adminWeeklyQuizStats,
  adminWeeklyQuizParticipants,
  adminAnnounceWinner,
  adminUnannounceWinner,
  publicGetWinner,
  adminDashboardStats,
} from '../controllers/weeklyQuizController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public ──────────────────────────────────────────────
router.get('/status',  publicWeeklyQuizStatus);
router.post('/start',  publicWeeklyQuizStart);
router.get('/current', publicWeeklyQuizCurrent);
router.post('/submit', publicWeeklyQuizSubmit);
router.get('/winner',  publicGetWinner);          // ← announced winner card

// ── Admin ────────────────────────────────────────────────
router.get('/admin/current',      protect, admin, adminWeeklyQuizCurrent);
router.post('/admin/save',        protect, admin, adminWeeklyQuizSave);
router.post('/admin/reset',       protect, admin, adminWeeklyQuizReset);
router.get('/admin/stats',        protect, admin, adminWeeklyQuizStats);
router.get('/admin/participants', protect, admin, adminWeeklyQuizParticipants);
router.post('/admin/announce-winner',   protect, admin, adminAnnounceWinner);
router.post('/admin/unannounce-winner', protect, admin, adminUnannounceWinner);
router.get('/admin/dashboard/stats',    protect, admin, adminDashboardStats);
router.patch('/admin/toggle',     protect, admin, toggleWeeklyQuizActive);

export default router;
