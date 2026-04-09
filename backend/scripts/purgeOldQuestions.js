import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../src/utils/dnsSetup.js';
import Question from '../src/models/Question.js';
import dbConnect from '../src/config/db.js';

dotenv.config();

const purgeOldQuestions = async () => {
  try {
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    const result = await Question.deleteMany({});
    console.log(`🗑️  Successfully deleted ${result.deletedCount} old questions.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error purging questions:', error.message);
    process.exit(1);
  }
};

purgeOldQuestions();
