import mongoose from 'mongoose';
import slugify from 'slugify';

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length === 4,
        message: 'Must have exactly 4 options',
      },
    },
    // Nepali translation fields (optional)
    questionTextNP: {
      type: String,
      default: '',
      trim: true,
    },
    optionsNP: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length === 0 || v.length === 4,
        message: 'Nepali options must be empty or exactly 4',
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
      required: true,
      enum: [
        'History', 'Geography', 'Science', 'Current Affairs', 'Constitution', 
        'World GK', 'Mathematics', 'GK', 'Loksewa', 'Literature', 'Computer', 'Sport', 'Other',
        'Nepal Electricity', 'Computer Operator', 'Banking Sector', 'नेपाल स्वास्थ्य', 
        'Nepal Police', 'Nepal Army'
      ],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

questionSchema.pre('save', async function (next) {
  if (this.isModified('questionText') || this.isNew) {
    let baseSlug = slugify(this.questionText, { lower: true, strict: true });
    
    // If slugify returns empty (common for Devnagari/Nepali text)
    if (!baseSlug) {
      // Use a generic prefix + first few characters of the id for uniqueness
      baseSlug = 'q-' + this._id.toString().slice(-6);
    }
    
    let slug = baseSlug;
    let counter = 1;
    
    // Use this.constructor to refer to the Model safely within the pre-save hook
    try {
      while (await this.constructor.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      this.slug = slug;
    } catch (err) {
      console.error('Slug generation error:', err);
      // Fallback to avoid save failure
      this.slug = baseSlug + '-' + Date.now();
    }
  }
  next();
});

export default mongoose.model('Question', questionSchema);
