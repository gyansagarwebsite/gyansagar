import mongoose from 'mongoose';
import WeeklyQuiz from '../models/WeeklyQuiz.js';
import WeeklyQuizAttempt from '../models/WeeklyQuizAttempt.js';
import Question from '../models/Question.js';
import Blog from '../models/Blog.js';
import Material from '../models/Material.js';
import Message from '../models/Message.js';
import { createNotification } from './notificationController.js';


/* ═══════════════════════════════════════════════════════════
   NPT (Nepal Time) / Saturday-window helpers
   ═══════════════════════════════════════════════════════════ */

const NPT_OFFSET_MS = 5.75 * 60 * 60 * 1000; // UTC + 5:45

/**
 * Returns a "fake UTC" date whose UTC methods give NPT values.
 * e.g. nptDate.getUTCHours() === current NPT hours
 */
const toNPT = (ref = new Date()) =>
  new Date(ref.getTime() + NPT_OFFSET_MS);

/**
 * Given a reference JS Date, compute the Saturday quiz window
 * that is ACTIVE for that moment, or the UPCOMING one.
 *
 * Quiz runs: Saturday 06:00 NPT → Saturday 23:00 NPT (same day).
 *
 * Returns UTC Date objects suitable for MongoDB storage/comparison.
 */
const getSaturdayWindow = (ref = new Date()) => {
  const npt = toNPT(ref);
  const day  = npt.getUTCDay();    // 0=Sun … 6=Sat
  const hour = npt.getUTCHours();
  const min  = npt.getUTCMinutes();
  const sec  = npt.getUTCSeconds();
  const ms   = npt.getUTCMilliseconds();

  // How many days ahead until the relevant Saturday?
  // If it's Saturday 23:00+ NPT already → target NEXT Saturday (7 days).
  // If it's Saturday before 23:00 NPT → today (0 days).
  // Otherwise → nearest upcoming Saturday.
  let daysAhead;
  if (day === 6) {
    daysAhead = (hour >= 23) ? 7 : 0;
  } else {
    daysAhead = (6 - day + 7) % 7;  // Sun→6, Mon→5, Tue→4, Wed→3, Thu→2, Fri→1
    if (daysAhead === 0) daysAhead = 7; // safety (shouldn't happen)
  }

  // NPT Saturday midnight (as NPT-offset ms value)
  const satMidnightNPT_ms =
    npt.getTime()             // current NPT-shifted timestamp
    + daysAhead * 86_400_000  // advance to target Saturday
    - hour * 3_600_000
    - min  *    60_000
    - sec  *     1_000
    - ms;

  // Convert back to real UTC timestamps
  const weekStartUTC = new Date(satMidnightNPT_ms - NPT_OFFSET_MS + 6  * 3_600_000); // 06:00 NPT
  const weekEndUTC   = new Date(satMidnightNPT_ms - NPT_OFFSET_MS + 23 * 3_600_000); // 23:00 NPT

  return { weekStart: weekStartUTC, weekEnd: weekEndUTC };
};

/** Is the current moment inside the Saturday quiz window? */
const isWithinQuizWindow = (ref = new Date()) => {
  const npt = toNPT(ref);
  const day  = npt.getUTCDay();
  const hour = npt.getUTCHours();
  return day === 6 && hour >= 6 && hour < 23; // Sat 06:00–22:59 NPT
};

/** Has the quiz window ended for THIS Saturday (i.e., Sat ≥ 23:00 NPT)? */
const isWindowJustEnded = (ref = new Date()) => {
  const npt = toNPT(ref);
  return npt.getUTCDay() === 6 && npt.getUTCHours() >= 23;
};

/** Utility: normalise a participant name */
const normalizeName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name.trim().toLowerCase();
};

/* ═══════════════════════════════════════════════════════════
   Auto-announcement (shared, called after window ends)
   ═══════════════════════════════════════════════════════════ */

/**
 * Picks the best participant (max score → min time → earliest submit)
 * and marks them as the public winner on the quiz document.
 * Idempotent: does nothing if already announced.
 */
const autoAnnounceWinner = async (quiz) => {
  if (!quiz || quiz.winnerAnnounced) return;

  const topAttempt = await WeeklyQuizAttempt.findOne({
    weeklyQuizId: quiz._id,
    completed: true,
  })
    .sort({ score: -1, timeTakenSeconds: 1, submittedAt: 1 })
    .select('userName score correctCount wrongCount timeTakenSeconds')
    .lean();

  if (!topAttempt) return; // no completions yet

  quiz.winnerAnnounced = true;
  quiz.winner = {
    userName:         topAttempt.userName,
    score:            topAttempt.score,
    totalQuestions:   quiz.questions.length,
    correctCount:     topAttempt.correctCount,
    wrongCount:       topAttempt.wrongCount,
    timeTakenSeconds: topAttempt.timeTakenSeconds,
    weekStart:        quiz.weekStart,
    weekEnd:          quiz.weekEnd,
    announcedAt:      new Date(),
    message:          '',
  };

  await quiz.save();
};

/**
 * Ensures a weekly quiz exists for the given window.
 * If it's currently Saturday > 07:00 AM NPT and no quiz is set,
 * it automatically generates one with 15 random questions.
 */
const ensureWeeklyQuizCreated = async (weekStart, weekEnd) => {
  let quiz = await WeeklyQuiz.findOne({ weekStart });
  if (quiz) return quiz;

  const now = new Date();
  const npt = toNPT(now);
  const isSaturday = npt.getUTCDay() === 6;
  const isPast7AM  = npt.getUTCHours() >= 7;

  // Auto-generate ONLY if it's Saturday 7 AM+ NPT and no quiz exists
  if (isSaturday && isPast7AM) {
    try {
      const allCategories = await Question.distinct('category');
      // Shuffle categories for variety
      const shuffledCats = allCategories.sort(() => 0.5 - Math.random());
      
      let selectedQuestionIds = [];
      const usedIds = new Set();

      // Phase 1: Try to get 1 unique question from each category until we hit 15
      for (const cat of shuffledCats) {
        if (selectedQuestionIds.length >= 15) break;
        
        const q = await Question.aggregate([
          { $match: { category: cat } },
          { $sample: { size: 1 } }
        ]);

        if (q && q[0]) {
          selectedQuestionIds.push(q[0]._id);
          usedIds.add(String(q[0]._id));
        }
      }

      // Phase 2: If we still need more (categories < 15), fill up with random questions
      if (selectedQuestionIds.length < 15) {
        const remainingNeeded = 15 - selectedQuestionIds.length;
        const extraQuestions = await Question.aggregate([
          { $match: { _id: { $nin: Array.from(usedIds).map(id => new mongoose.Types.ObjectId(id)) } } },
          { $sample: { size: remainingNeeded } }
        ]);

        extraQuestions.forEach(q => selectedQuestionIds.push(q._id));
      }

      if (selectedQuestionIds.length === 15) {
        quiz = await WeeklyQuiz.create({
          title: 'Weekly Loksewa & GK Quiz (Auto-mode)',
          description: 'Automatically selected 15 questions across various categories for this week\'s challenge.',
          questions: selectedQuestionIds,
          weekStart,
          weekEnd,
          isActive: true
        });
        console.log(`[AutoQuiz] Successfully created quiz for ${weekStart}`);
        return quiz;
      }
    } catch (err) {
      console.error('[AutoQuiz] Failed to auto-generate quiz:', err);
    }
  }
  return null;
};

/* ═══════════════════════════════════════════════════════════
   PUBLIC ENDPOINTS
   ═══════════════════════════════════════════════════════════ */

/**
 * GET /weekly-quiz/status
 * Returns real-time schedule status for the public site.
 * Also triggers auto-announcement the first time it's called
 * after Saturday 23:00 NPT.
 */
export const publicWeeklyQuizStatus = async (req, res) => {
  try {
    const now = new Date();
    const { weekStart, weekEnd } = getSaturdayWindow(now);
    const inWindow  = isWithinQuizWindow(now);
    const justEnded = isWindowJustEnded(now);

    // ── Auto-generate quiz if past Sat 7 AM and none set ──
    let quiz = await ensureWeeklyQuizCreated(weekStart, weekEnd);

    // If still none, find the quiz set up for this Saturday (or latest)
    if (!quiz) {
      quiz = await WeeklyQuiz.findOne({ weekStart }).exec()
        || await WeeklyQuiz.findOne().sort({ weekStart: -1 }).exec();
    }

    // ── Auto-announce immediately after 23:00 Saturday ──
    if (justEnded && quiz && !quiz.winnerAnnounced) {
      try { await autoAnnounceWinner(quiz); } catch (_) { /* non-blocking */ }
    }

    // No quiz set up at all
    if (!quiz) {
      return res.json({
        isActive:        false,
        status:          'no_quiz',
        nextQuizStart:   weekStart,
        nextQuizEnd:     weekEnd,
        timeLimitSeconds: 150,
        schedule: { day: 'Saturday', startTZ: '6:00 AM NPT', endTZ: '11:00 PM NPT' },
      });
    }

    // Determine which window this quiz belongs to
    const quizInWindow = inWindow && quiz.weekStart.getTime() === weekStart.getTime();

    let status;
    if (quizInWindow) {
      status = 'active';
    } else if (justEnded && quiz.weekStart.getTime() === weekStart.getTime()) {
      status = 'ended';
    } else if (now < weekStart) {
      status = 'scheduled';
    } else {
      status = 'ended'; // general fallback for past quizzes
    }

    return res.json({
      isActive:         status === 'active',
      status,
      quizId:           quiz._id,
      title:            quiz.title,
      description:      quiz.description,
      totalQuestions:   quiz.questions.length,
      timeLimitSeconds: 150,
      nextQuizStart:    weekStart,
      nextQuizEnd:      weekEnd,
      schedule: { day: 'Saturday', startTZ: '6:00 AM NPT', endTZ: '11:00 PM NPT' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /weekly-quiz/start
 * Initialises an attempt record. Only allowed during the window.
 */
export const publicWeeklyQuizStart = async (req, res) => {
  try {
    const now = new Date();
    if (!isWithinQuizWindow(now)) {
      return res.status(400).json({
        message: 'The quiz is not live right now. It runs every Saturday from 6:00 AM to 11:00 PM (NPT). Please come back then!',
      });
    }

    const { userName } = req.body;
    if (!userName || !userName.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const { weekStart } = getSaturdayWindow(now);
    const quiz = await WeeklyQuiz.findOne({ weekStart });

    if (!quiz) {
      return res.status(400).json({
        message: 'Quiz questions have not been set up for this Saturday yet. Please check back later.',
      });
    }

    const normalized = normalizeName(userName);
    const existing   = await WeeklyQuizAttempt.findOne({
      weeklyQuizId: quiz._id,
      userNameNormalized: normalized,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already attempted this week\'s quiz.' });
    }

    await WeeklyQuizAttempt.create({
      weeklyQuizId:       quiz._id,
      userName:           userName.trim(),
      userNameNormalized: normalized,
      answers:            [],
      score:              0,
      correctCount:       0,
      wrongCount:         0,
      unansweredCount:    15,
      timeTakenSeconds:   0,
      completed:          false,
      timedOut:           false,
    });

    res.json({
      quizId:           quiz._id,
      totalQuestions:   quiz.questions.length,
      timeLimitSeconds: 150,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already attempted this week\'s quiz.' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /weekly-quiz/current
 * Returns questions for the active quiz.
 */
export const publicWeeklyQuizCurrent = async (req, res) => {
  try {
    const now = new Date();
    // Allow a 3-minute grace after window close (in-progress submissions)
    const gracePeriodEnd = new Date(now.getTime() - 3 * 60 * 1000);
    const { weekStart } = getSaturdayWindow(gracePeriodEnd);
    const quiz = await WeeklyQuiz.findOne({ weekStart }).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'No active weekly quiz available.' });
    }

    res.json({
      quizId:           quiz._id,
      title:            quiz.title,
      description:      quiz.description,
      timeLimitSeconds: 150,
      questions: quiz.questions.map((q) => ({
        _id:           q._id,
        questionText:  q.questionText,
        options:       q.options,
        category:      q.category,
        correctAnswer: q.correctAnswer,
        explanation:   q.explanation || '',
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /weekly-quiz/submit
 * Scores and saves the attempt.
 */
export const publicWeeklyQuizSubmit = async (req, res) => {
  try {
    const { quizId, userName, answers = [], timeTakenSeconds = 0 } = req.body;
    if (!quizId || !userName?.trim()) {
      return res.status(400).json({ message: 'quizId and userName are required.' });
    }

    const normalized = normalizeName(userName);
    const quiz       = await WeeklyQuiz.findById(quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    const existingAttempt = await WeeklyQuizAttempt.findOne({
      weeklyQuizId:       quiz._id,
      userNameNormalized: normalized,
    });
    if (!existingAttempt) {
      return res.status(400).json({ message: 'No start record found. Please start the quiz first.' });
    }
    if (existingAttempt.completed) {
      return res.status(400).json({ message: 'You have already submitted this week\'s quiz.' });
    }

    const qmap = new Map();
    quiz.questions.forEach((q) => qmap.set(String(q._id), q));

    let correct = 0, wrong = 0, unanswered = 0;
    const processedAnswers = [];

    for (const answerRecord of answers) {
      const question   = qmap.get(String(answerRecord.questionId));
      if (!question) continue;

      const selectedRaw = answerRecord.selectedAnswer;
      const selectedIdx = (selectedRaw !== null && selectedRaw !== undefined && selectedRaw !== '')
        ? Number(selectedRaw) : null;
      const hasValid    = selectedIdx !== null && [0, 1, 2, 3].includes(selectedIdx);
      const isCorrect   = hasValid && selectedIdx === question.correctAnswer;

      if (!hasValid) unanswered += 1;
      else if (isCorrect) correct += 1;
      else wrong += 1;

      processedAnswers.push({
        questionId:    question._id,
        selectedAnswer: hasValid ? selectedIdx : null,
        correctAnswer:  question.correctAnswer,
        isCorrect,
      });
    }

    const finalScore = correct;
    const timedOut   = Number(timeTakenSeconds) > 150;

    existingAttempt.answers          = processedAnswers;
    existingAttempt.score            = finalScore;
    existingAttempt.correctCount     = correct;
    existingAttempt.wrongCount       = wrong;
    existingAttempt.unansweredCount  = unanswered;
    existingAttempt.timeTakenSeconds = Number(timeTakenSeconds);
    existingAttempt.submittedAt      = new Date();
    existingAttempt.completed        = true;
    existingAttempt.timedOut         = timedOut;
    await existingAttempt.save();

    res.json({
      userName:       existingAttempt.userName,
      score:          finalScore,
      correctCount:   correct,
      wrongCount:     wrong,
      unansweredCount: unanswered,
      percentage:     quiz.questions.length
        ? Math.round((correct / quiz.questions.length) * 100) : 0,
      timedOut,
      totalQuestions: quiz.questions.length,
      results:        processedAnswers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /weekly-quiz/winner
 * Returns the most recently announced (or auto-announced) winner.
 * Also triggers auto-announcement if the window just ended.
 */
export const publicGetWinner = async (req, res) => {
  try {
    const now       = new Date();
    const justEnded = isWindowJustEnded(now);
    const { weekStart } = getSaturdayWindow(now);

    // If window just ended, auto-announce if not done
    if (justEnded) {
      const todayQuiz = await WeeklyQuiz.findOne({ weekStart });
      if (todayQuiz && !todayQuiz.winnerAnnounced) {
        try { await autoAnnounceWinner(todayQuiz); } catch (_) {}
      }
    }

    const quiz = await WeeklyQuiz.findOne({ winnerAnnounced: true })
      .sort({ 'winner.announcedAt': -1 })
      .select('winner winnerAnnounced weekStart weekEnd title')
      .lean();

    if (!quiz?.winnerAnnounced) {
      return res.json({ hasWinner: false, winner: null });
    }

    res.json({
      hasWinner: true,
      winner: { ...quiz.winner, quizTitle: quiz.title },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   ADMIN ENDPOINTS
   ═══════════════════════════════════════════════════════════ */

/**
 * GET /admin/current
 * Returns the current/latest quiz state for the admin panel.
 */
export const adminWeeklyQuizCurrent = async (req, res) => {
  try {
    const now              = new Date();
    const { weekStart, weekEnd } = getSaturdayWindow(now);
    const inWindow         = isWithinQuizWindow(now);
    const justEnded        = isWindowJustEnded(now);

    // ── Auto-generate quiz if past Sat 7 AM and none set ──
    let quiz = await ensureWeeklyQuizCreated(weekStart, weekEnd);

    // If still none, find quiz for this Saturday, else latest
    if (!quiz) {
      quiz =
        await WeeklyQuiz.findOne({ weekStart }).populate('questions') ||
        await WeeklyQuiz.findOne().sort({ weekStart: -1 }).populate('questions');
    }

    const attemptCount     = quiz ? await WeeklyQuizAttempt.countDocuments({ weeklyQuizId: quiz._id }) : 0;
    const participantNames = quiz ? await WeeklyQuizAttempt.distinct('userNameNormalized', { weeklyQuizId: quiz._id }) : [];

    if (!quiz) {
      return res.json({
        quiz:              null,
        status:            'no_quiz',
        canReset:          false,
        weekStart,
        weekEnd,
        attemptCount:      0,
        totalParticipants: 0,
        isActive:          false,
        winnerAnnounced:   false,
        winner:            null,
        nextQuizStart:     weekStart,
        nextQuizEnd:       weekEnd,
        schedule: { day: 'Saturday', startTZ: '6:00 AM NPT', endTZ: '11:00 PM NPT' },
      });
    }

    // Compute status based on time
    let status;
    const quizIsThisSaturday = quiz.weekStart.getTime() === weekStart.getTime();
    if (inWindow && quizIsThisSaturday) {
      status = 'active';
    } else if (justEnded && quizIsThisSaturday) {
      status = 'ended';
    } else if (now < weekStart) {
      status = 'scheduled';
    } else {
      status = 'ended'; // a past quiz
    }

    res.json({
      quiz,
      status,
      canReset:          true,
      weekStart:         quiz.weekStart,
      weekEnd:           quiz.weekEnd,
      attemptCount,
      totalParticipants: participantNames.length,
      isActive:          status === 'active',
      winnerAnnounced:   quiz.winnerAnnounced ?? false,
      winner:            quiz.winner ?? null,
      nextQuizStart:     weekStart,
      nextQuizEnd:       weekEnd,
      schedule: { day: 'Saturday', startTZ: '6:00 AM NPT', endTZ: '11:00 PM NPT' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /admin/save
 * Admin saves 15 questions for the upcoming Saturday.
 * Can be done anytime Sunday–Friday (or even after reset on Sat night).
 */
export const adminWeeklyQuizSave = async (req, res) => {
  try {
    const { title = 'Weekly Loksewa & GK Quiz', description = 'Weekly Loksewa & GK Quiz', questions } = req.body;

    if (!Array.isArray(questions) || questions.length !== 15) {
      return res.status(400).json({ message: 'Exactly 15 questions are required.' });
    }
    if (!questions.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: 'Invalid question ID provided.' });
    }

    const now = new Date();
    const { weekStart, weekEnd } = getSaturdayWindow(now);

    // Deactivate any lingering active quizzes (legacy)
    await WeeklyQuiz.updateMany({ isActive: true }, { $set: { isActive: false } });

    // Upsert for this Saturday
    let quiz = await WeeklyQuiz.findOne({ weekStart });

    if (quiz) {
      quiz.title       = title.trim();
      quiz.description = description.trim();
      quiz.questions   = questions;
      quiz.weekStart   = weekStart;
      quiz.weekEnd     = weekEnd;
      quiz.isActive    = true;
      await quiz.save();
    } else {
      quiz = await WeeklyQuiz.create({
        title:       title.trim(),
        description: description.trim(),
        questions,
        weekStart,
        weekEnd,
        isActive:    true,
      });
    }

    // Create notification
    await createNotification({
      title: 'New Weekly Quiz',
      message: `Weekly challenge ready: ${quiz.title}`,
      type: 'quiz',
      link: '/quiz',
    });

    res.status(201).json({

      message: `Quiz saved for Saturday ${weekStart.toLocaleDateString('en-US')}. It will go live automatically at 6:00 AM NPT.`,
      quiz: { ...quiz.toObject(), questions },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /admin/reset
 * Deletes the current quiz and ALL attempts so admin can start fresh next week.
 */
export const adminWeeklyQuizReset = async (req, res) => {
  try {
    const quizToReset =
      await WeeklyQuiz.findOne({ isActive: true }) ||
      await WeeklyQuiz.findOne().sort({ weekStart: -1 });

    if (!quizToReset) {
      return res.status(404).json({ message: 'No quiz found to reset.' });
    }

    await WeeklyQuizAttempt.deleteMany({ weeklyQuizId: quizToReset._id });
    await WeeklyQuiz.findByIdAndDelete(quizToReset._id);

    res.json({ message: 'Weekly quiz reset successfully. Ready for the next Saturday.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminWeeklyQuizStats = async (req, res) => {
  try {
    const now = new Date();
    const { weekStart } = getSaturdayWindow(now);
    const quiz = await WeeklyQuiz.findOne({ weekStart }) || await WeeklyQuiz.findOne().sort({ weekStart: -1 });
    const totalAttempts    = quiz ? await WeeklyQuizAttempt.countDocuments({ weeklyQuizId: quiz._id }) : 0;
    const participantNames = quiz ? await WeeklyQuizAttempt.distinct('userNameNormalized', { weeklyQuizId: quiz._id }) : [];

    res.json({
      totalAttempts,
      totalParticipants:  participantNames.length,
      activeQuizStatus:   isWithinQuizWindow(now) && quiz ? 'active' : 'inactive',
      currentWeekStart:   quiz?.weekStart ?? null,
      currentWeekEnd:     quiz?.weekEnd   ?? null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Legacy: kept so routes don't break. Toggle is now schedule-driven. */
export const toggleWeeklyQuizActive = async (req, res) => {
  res.json({ success: true, message: 'Quiz activation is now schedule-driven (Saturday 6AM–11PM NPT).' });
};

/**
 * GET /admin/participants
 */
export const adminWeeklyQuizParticipants = async (req, res) => {
  try {
    const now        = new Date();
    const { weekStart } = getSaturdayWindow(now);
    const quiz =
      await WeeklyQuiz.findOne({ weekStart }) ||
      await WeeklyQuiz.findOne().sort({ weekStart: -1 });

    if (!quiz) return res.json({ quiz: null, participants: [], total: 0 });

    const attempts = await WeeklyQuizAttempt.find({ weeklyQuizId: quiz._id, completed: true })
      .sort({ score: -1, timeTakenSeconds: 1, submittedAt: 1 })
      .select('userName score correctCount wrongCount unansweredCount timeTakenSeconds timedOut submittedAt')
      .lean();

    let rank = 1;
    const ranked = attempts.map((a, i) => {
      if (i > 0 && (a.score !== attempts[i-1].score || a.timeTakenSeconds !== attempts[i-1].timeTakenSeconds)) {
        rank = i + 1;
      }
      return {
        rank,
        userName:         a.userName,
        score:            a.score,
        correctCount:     a.correctCount,
        wrongCount:       a.wrongCount,
        unansweredCount:  a.unansweredCount,
        timeTakenSeconds: a.timeTakenSeconds,
        timedOut:         a.timedOut,
        submittedAt:      a.submittedAt,
      };
    });

    res.json({
      quiz: {
        _id:            quiz._id,
        title:          quiz.title,
        weekStart:      quiz.weekStart,
        weekEnd:        quiz.weekEnd,
        totalQuestions: quiz.questions.length,
      },
      participants: ranked,
      total:        ranked.length,
      topScore:     ranked.length > 0 ? ranked[0].score : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /admin/announce-winner  (manual override — normally auto)
 */
export const adminAnnounceWinner = async (req, res) => {
  try {
    const { message = '' } = req.body;
    const now = new Date();
    const { weekStart } = getSaturdayWindow(now);
    const quiz =
      await WeeklyQuiz.findOne({ weekStart }) ||
      await WeeklyQuiz.findOne().sort({ weekStart: -1 });

    if (!quiz) return res.status(404).json({ message: 'No quiz found.' });

    const topAttempt = await WeeklyQuizAttempt.findOne({ weeklyQuizId: quiz._id, completed: true })
      .sort({ score: -1, timeTakenSeconds: 1, submittedAt: 1 })
      .select('userName score correctCount wrongCount timeTakenSeconds')
      .lean();

    if (!topAttempt) return res.status(400).json({ message: 'No completed attempts yet.' });

    quiz.winnerAnnounced = true;
    quiz.winner = {
      userName:         topAttempt.userName,
      score:            topAttempt.score,
      totalQuestions:   quiz.questions.length,
      correctCount:     topAttempt.correctCount,
      wrongCount:       topAttempt.wrongCount,
      timeTakenSeconds: topAttempt.timeTakenSeconds,
      weekStart:        quiz.weekStart,
      weekEnd:          quiz.weekEnd,
      announcedAt:      new Date(),
      message:          message.trim(),
    };
    await quiz.save();

    res.json({ success: true, message: 'Winner announced.', winner: quiz.winner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /admin/unannounce-winner
 */
export const adminUnannounceWinner = async (req, res) => {
  try {
    const now = new Date();
    const { weekStart } = getSaturdayWindow(now);
    const quiz =
      await WeeklyQuiz.findOne({ weekStart }) ||
      await WeeklyQuiz.findOne().sort({ weekStart: -1 });

    if (!quiz) return res.status(404).json({ message: 'No quiz found.' });
    quiz.winnerAnnounced = false;
    await quiz.save();
    res.json({ success: true, message: 'Announcement removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /admin/dashboard/stats
 */
export const adminDashboardStats = async (req, res) => {
  try {
    const [questionCount, blogCount, materialCount, messageCount] = await Promise.all([
      Question.countDocuments({}),
      Blog.countDocuments({}),
      Material.countDocuments({}),
      Message.countDocuments({}),
    ]);

    const now  = new Date();
    const { weekStart } = getSaturdayWindow(now);
    const quiz = await WeeklyQuiz.findOne({ weekStart }) || await WeeklyQuiz.findOne().sort({ weekStart: -1 });
    const weeklyQuizAttempts      = quiz ? await WeeklyQuizAttempt.countDocuments({ weeklyQuizId: quiz._id }) : 0;
    const weeklyQuizQuestionsCount = quiz ? quiz.questions.length : 0;

    res.json({
      totalQuestions: questionCount,
      totalBlogs:     blogCount,
      totalMaterials: materialCount,
      totalMessages:  messageCount,
      weeklyQuizQuestionsCount,
      activeQuizStatus: isWithinQuizWindow(now) && quiz ? 'active' : 'inactive',
      weeklyQuizAttempts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
