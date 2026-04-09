// trim_to_100.js
// Final cleanup script to ensure exactly 100 questions per category as requested.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const questionSchema = new mongoose.Schema({
  category: String,
  questionText: { type: String, unique: true },
  options: [String],
  correctAnswer: Number,
  difficulty: String,
  explanation: String
}, { timestamps: true });

import dns from 'dns';

const Question = mongoose.model('Question', questionSchema);

const categories = [
  'History', 'Geography', 'Constitution', 'Science', 'Current Affairs',
  'World GK', 'Mathematics', 'GK', 'Loksewa', 'Literature', 'Computer', 'Other'
];

async function trimCategories() {
  try {
    console.log('🚀 Setting up custom DNS for MongoDB SRV...');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('✅ Google DNS + Cloudflare active for SRV resolution');

    console.log('🚀 Connecting to MongoDB for final trim...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    for (const cat of categories) {
      const count = await Question.countDocuments({ category: cat });
      console.log(`Checking ${cat}: ${count} questions...`);

      if (count > 100) {
        const toDelete = count - 100;
        console.log(`Trimming ${toDelete} questions from ${cat}...`);
        
        // Find the newest 'toDelete' questions to remove, keeping the oldest 100
        const excess = await Question.find({ category: cat })
          .sort({ createdAt: -1 })
          .limit(toDelete)
          .select('_id');
        
        const ids = excess.map(q => q._id);
        await Question.deleteMany({ _id: { $in: ids } });
        console.log(`✅ ${cat} trimmed to 100.`);
      } else if (count < 100) {
        console.warn(`⚠️ Warning: ${cat} only has ${count} questions. Needs more!`);
      } else {
        console.log(`✅ ${cat} is already exactly 100.`);
      }
    }

    console.log('\n--- Final Count Check ---');
    for (const cat of categories) {
      const finalCount = await Question.countDocuments({ category: cat });
      console.log(`${cat.padEnd(15)}: ${finalCount}`);
    }

  } catch (error) {
    console.error('❌ Error during trimming:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

trimCategories();
