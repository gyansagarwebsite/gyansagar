import mongoose from 'mongoose';

const heroSettingsSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'Prepare Smartly for Loksewa'
  },
  heroSubtitle: {
    type: String,
    default: 'Daily GK questions and study materials'
  },
  heroButtonText: {
    type: String,
    default: 'Start Learning'
  },
  heroImage: {
    type: String,
    default: ''
  },
  facebookLink: {
    type: String,
    default: 'https://facebook.com/gyansagar'
  },
  facebookImage: {
    type: String,
    default: ''
  },
  facebookDescription: {
    type: String,
    default: 'Daily GK questions to boost your preparation for competitive exams.'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('HeroSettings', heroSettingsSchema);
