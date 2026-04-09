import mongoose from 'mongoose';

const dailyQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length === 4,
        message: 'Must have exactly 4 options',
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
    },
    explanation: {
      type: String,
      default: '',
    },
    category: {
        type: String,
        default: 'General'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Helper to get only the date part for comparison
dailyQuestionSchema.pre('save', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    d.setHours(0, 0, 0, 0);
    this.date = d;
  }
  next();
});

export default mongoose.model('DailyQuestion', dailyQuestionSchema);
