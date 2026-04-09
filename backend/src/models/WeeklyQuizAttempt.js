import mongoose from 'mongoose';

const weeklyQuizAttemptSchema = new mongoose.Schema(
  {
    weeklyQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeeklyQuiz',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userNameNormalized: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        selectedAnswer: {
          type: Number,       // numeric index 0-3, or null if skipped
          enum: [0, 1, 2, 3, null],
          default: null,
        },
        correctAnswer: {
          type: Number,       // numeric index 0-3
          enum: [0, 1, 2, 3],
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: { type: Number, required: true, default: 0 },
    correctCount: { type: Number, required: true, default: 0 },
    wrongCount: { type: Number, required: true, default: 0 },
    unansweredCount: { type: Number, required: true, default: 0 },
    timeTakenSeconds: { type: Number, required: true, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: true },
    timedOut: { type: Boolean, default: false },
  },
  { timestamps: true }
);

weeklyQuizAttemptSchema.index({ weeklyQuizId: 1, userNameNormalized: 1 }, { unique: true });

weeklyQuizAttemptSchema.pre('validate', function (next) {
  if (this.userName) {
    this.userNameNormalized = this.userName.trim().toLowerCase();
  }
  next();
});

export default mongoose.model('WeeklyQuizAttempt', weeklyQuizAttemptSchema);
