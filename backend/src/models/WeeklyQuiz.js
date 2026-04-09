import mongoose from 'mongoose';

const weeklyQuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: 'Weekly Loksewa & GK Quiz',
      trim: true,
    },
    weekStart: {
      type: Date,
      required: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Question',
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 15,
        message: 'Weekly quiz must contain exactly 15 questions',
      },
    },

    /* ── Winner announcement ── */
    winnerAnnounced: {
      type: Boolean,
      default: false,
    },
    winner: {
      userName:         { type: String, default: null },
      score:            { type: Number, default: null },
      totalQuestions:   { type: Number, default: 15 },
      correctCount:     { type: Number, default: null },
      wrongCount:       { type: Number, default: null },
      timeTakenSeconds: { type: Number, default: null },
      weekStart:        { type: Date,   default: null },
      weekEnd:          { type: Date,   default: null },
      announcedAt:      { type: Date,   default: null },
      message:          { type: String, default: '' },
    },
  },
  { timestamps: true }
);

weeklyQuizSchema.index({ weekStart: 1, weekEnd: 1 });
weeklyQuizSchema.index({ isActive: 1 });
weeklyQuizSchema.index({ winnerAnnounced: 1, 'winner.weekStart': -1 });

export default mongoose.model('WeeklyQuiz', weeklyQuizSchema);

