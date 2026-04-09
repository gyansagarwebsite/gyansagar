import Quiz from '../models/Quiz.js';
import WeeklyQuiz from '../models/WeeklyQuiz.js';
import WeeklyQuizAttempt from '../models/WeeklyQuizAttempt.js';
import Question from '../models/Question.js';
import Blog from '../models/Blog.js';
import Material from '../models/Material.js';
import Message from '../models/Message.js';

/**
 * Get dashboard stats (admin)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [questionCount, blogCount, materialCount, messageCount] = await Promise.all([
      Question.countDocuments({}),
      Blog.countDocuments({}),
      Material.countDocuments({}),
      Message.countDocuments({}),
    ]);

    const activeQuiz = await WeeklyQuiz.findOne({ isActive: true });
    const weeklyQuizQuestionsCount = activeQuiz?.questions?.length || 0;
    const weeklyQuizAttempts = activeQuiz ? await WeeklyQuizAttempt.countDocuments({ weeklyQuizId: activeQuiz._id }) : 0;

    res.json({
      totalQuestions: questionCount,
      totalBlogs: blogCount,
      totalMaterials: materialCount,
      totalMessages: messageCount,
      weeklyQuizQuestionsCount,
      weeklyQuizAttempts,
      activeQuizStatus: activeQuiz ? 'published' : 'draft',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get active weekly quiz (public endpoint)
 */
export const getWeeklyQuiz = async (req, res) => {
  try {
    const now = new Date();
    const quiz = await WeeklyQuiz.findOne({
      isActive: true,
      weekStart: { $lte: now },
      weekEnd: { $gte: now },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'No active weekly quiz found' });
    }

    res.json({
      title: quiz.title,
      description: quiz.description,
      totalQuestions: quiz.questions.length,
      weekStart: quiz.weekStart,
      weekEnd: quiz.weekEnd,
      timeLimitSeconds: 150,
      isActive: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current weekly quiz for admin
 */
export const getWeeklyQuizAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({}).sort({ createdAt: -1 }).populate('questions');

    if (!quiz) {
      return res.json({ 
        message: 'No weekly quiz configured yet',
        quiz: null,
        questionCount: 0,
        isPublished: false
      });
    }

    res.json({
      quiz,
      questionCount: quiz.questions?.length || 0,
      isPublished: quiz.isActive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all quizzes (admin)
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 })
      .populate('questions', 'questionText category');

    res.json({
      quizzes,
      total: quizzes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create weekly quiz (admin)
 */
export const createWeeklyQuiz = async (req, res) => {
  try {
    const { title, description = '', questions = [] } = req.body;

    if (!Array.isArray(questions) || questions.length !== 15) {
      return res.status(400).json({ message: 'Weekly quiz must contain exactly 15 questions' });
    }

    const existingCount = await Question.countDocuments({ _id: { $in: questions } });
    if (existingCount !== 15) {
      return res.status(400).json({ message: 'Some selected questions are invalid' });
    }

    await Quiz.updateMany({ isActive: true }, { $set: { isActive: false } });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const quiz = await Quiz.create({
      title: title || 'Weekly Loksewa & GK Quiz',
      description,
      questions,
      startDate,
      endDate,
      isActive: true,
    });

    const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');
    res.status(201).json(populatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update weekly quiz (admin)
 */
export const updateWeeklyQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description = '', questions = [], isActive } = req.body;

    if (!Array.isArray(questions) || questions.length !== 15) {
      return res.status(400).json({ message: 'Weekly quiz must contain exactly 15 questions' });
    }

    const existingCount = await Question.countDocuments({ _id: { $in: questions } });
    if (existingCount !== 15) {
      return res.status(400).json({ message: 'Some selected questions are invalid' });
    }

    // If activating this quiz, deactivate all others
    if (isActive === true) {
      await Quiz.updateMany({ _id: { $ne: id } }, { $set: { isActive: false } });
    }

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { title, description, questions, isActive },
      { new: true }
    ).populate('questions');

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Publish/unpublish weekly quiz
 */
export const togglePublishQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (req.body.isActive) {
      await Quiz.updateMany({ _id: { $ne: id } }, { $set: { isActive: false } });
    }

    quiz.isActive = req.body.isActive;
    await quiz.save();

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete quiz
 */
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
