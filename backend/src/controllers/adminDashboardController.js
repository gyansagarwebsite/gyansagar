import Question from '../models/Question.js';
import Material from '../models/Material.js';
import Blog from '../models/Blog.js';
import WeeklyQuiz from '../models/WeeklyQuiz.js';
import WeeklyQuizAttempt from '../models/WeeklyQuizAttempt.js';
import Message from '../models/Message.js';

/**
 * Get comprehensive dashboard statistics for the admin panel
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get unique participants count from WeeklyQuizAttempt
    const [
      totalQuestions,
      totalMaterials,
      totalBlogs,
      totalMessages,
      uniqueParticipants,
      weeklyQuiz
    ] = await Promise.all([
      Question.countDocuments(),
      Material.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments(),
      WeeklyQuizAttempt.distinct('userNameNormalized'),
      WeeklyQuiz.findOne({ isActive: true }).sort({ createdAt: -1 }) // Get the most recent active quiz
    ]);

    const totalUsers = uniqueParticipants.length;

    // Get weekly quiz attempts if an active quiz exists
    let weeklyQuizStats = {
      questionsCount: 0,
      attemptsCount: 0,
      status: 'none'
    };

    if (weeklyQuiz) {
      // Count attempts from the WeeklyQuizAttempt model for this specific quiz
      const attemptsCount = await WeeklyQuizAttempt.countDocuments({ 
        weeklyQuizId: weeklyQuiz._id 
      });

      weeklyQuizStats = {
        questionsCount: weeklyQuiz.questions?.length || 0,
        attemptsCount: attemptsCount,
        status: weeklyQuiz.isActive ? 'active' : 'draft'
      };
    }

    res.json({
      totalUsers, // This now represents unique participants
      totalQuestions,
      totalMaterials,
      totalBlogs,
      totalMessages,
      weeklyQuiz: weeklyQuizStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

