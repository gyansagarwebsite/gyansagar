import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './src/utils/dnsSetup.js';
import Question from './src/models/Question.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const CATEGORIES = [
  'History', 'Geography', 'Constitution', 'Science', 'Current Affairs',
  'World GK', 'Mathematics', 'GK', 'Literature', 'Computer', 'Loksewa', 'Sport', 'Other',
  'Nepal Electricity', 'Computer Operator', 'Banking Sector', 'नेपाल स्वास्थ्य', 
  'Nepal Police', 'Nepal Army'
];

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('✅ Connected to MongoDB\n');
    
    console.log('Category Counts Verification:');
    console.log('-----------------------------');
    
    let totalCount = 0;
    for (const cat of CATEGORIES) {
      const count = await Question.countDocuments({ category: cat });
      console.log(`${cat.padEnd(16)}: ${count} questions`);
      totalCount += count;
    }
    
    console.log('-----------------------------');
    console.log(`GRAND TOTAL      : ${totalCount} questions`);
    
    const duplicates = await Question.aggregate([
      { $group: { _id: "$questionText", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    if (duplicates.length > 0) {
      console.log(`⚠️ Found ${duplicates.length} duplicate question strings.`);
    } else {
      console.log('✅ All question strings are unique.');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

verify();
