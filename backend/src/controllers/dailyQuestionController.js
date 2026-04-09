import DailyQuestion from '../models/DailyQuestion.js';
import { createNotification } from './notificationController.js';


// Get the question for today or by specific ID
export const getTodayQuestion = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const question = await DailyQuestion.findById(id);
      if (!question) return res.json(null);
      return res.json(question);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the most recently created question for the target date
    const question = await DailyQuestion.findOne({ date: today }).sort({ createdAt: -1 });
    
    if (!question) {
      return res.json(null);
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create daily question (Admin)
export const upsertDailyQuestion = async (req, res) => {
  try {
    // Defensive: Drop unique date index if it exists (one-time attempt)
    try {
      await DailyQuestion.collection.dropIndex('date_1');
    } catch (e) {
      // Index likely doesn't exist or already dropped, ignore
    }

    const { date, questionText, options, correctAnswer, explanation, category, difficulty } = req.body;
    
    // Default to today if not provided
    const targetDate = new Date(date || Date.now());
    targetDate.setHours(0, 0, 0, 0);

    // Create a new record every time to maintain history
    const question = new DailyQuestion({
      date: targetDate,
      questionText,
      options,
      correctAnswer,
      explanation,
      category,
      difficulty
    });
    
    await question.save();

    // Create notification
    await createNotification({
      title: "Today's Question",
      message: `New challenge: ${question.questionText.substring(0, 50)}...`,
      type: 'question',
      link: '/',
    });

    res.json(question);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all daily questions (Admin)
export const getAllDailyQuestions = async (req, res) => {
  try {
    // Sort by createdAt so the most recent work is always at the top
    const questions = await DailyQuestion.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete daily question (Admin)
export const deleteDailyQuestion = async (req, res) => {
    try {
        const question = await DailyQuestion.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Daily question not found' });
        }
        res.json({ message: 'Daily question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
