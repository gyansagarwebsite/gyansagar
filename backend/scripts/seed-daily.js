import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DailyQuestion from '../src/models/DailyQuestion.js';
import '../src/utils/dnsSetup.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Delete existing to be clean
    await DailyQuestion.deleteMany({ date: today });

    const q = new DailyQuestion({
      date: today,
      questionText: 'Test Daily Question: What is the capital of Nepal?',
      options: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur'],
      correctAnswer: 0,
      explanation: 'Kathmandu is the capital of Nepal.',
      category: 'Geography'
    });

    await q.save();
    console.log('Daily question seeded for today!');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    process.exit(0);
  }
}

seed();
