import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../src/utils/dnsSetup.js';
import Question from '../src/models/Question.js';
import { REAL_LOKSEWA_DATA } from './real-loksewa-data.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const GENERAL_CATEGORIES = [
  'History', 'Geography', 'Constitution', 'Science', 'Current Affairs',
  'World GK', 'Mathematics', 'GK', 'Literature', 'Computer', 'Loksewa', 'Sport', 'Other'
];

const EXAM_POSTS = [
  'Nepal Electricity', 'Computer Operator', 'Banking Sector', 'नेपाल स्वास्थ्य', 
  'Nepal Police', 'Nepal Army'
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('✅ Connected to MongoDB');

    console.log('➡️ Seeding real Loksewa questions...');
    const existingTexts = new Set((await Question.find({}, 'questionText')).map(q => q.questionText));
    const newQuestions = REAL_LOKSEWA_DATA.filter(q => !existingTexts.has(q.questionText));
    
    if (newQuestions.length > 0) {
      await Question.insertMany(newQuestions);
      console.log(`✅ Added ${newQuestions.length} new questions from curated list.`);
    } else {
      console.log('✅ No new questions to add.');
    }

    // Target counts
    // General: 10 sets * 10 = 100
    // Exams: 6 sets * 10 = 60

    console.log('➡️ Checking for categories with less than 10 questions per set...');
    
    const allCats = [...GENERAL_CATEGORIES, ...EXAM_POSTS];
    
    for (const cat of allCats) {
      const target = GENERAL_CATEGORIES.includes(cat) ? 100 : 60;
      let currentCount = await Question.countDocuments({ category: cat });
      
      if (currentCount < target) {
        console.log(`⚠️ Category [${cat}] has ${currentCount}/${target} questions. Generating ${target - currentCount} filler questions...`);
        
        const fillersNeeded = target - currentCount;
        const fillers = [];
        
        for (let i = 0; i < fillersNeeded; i++) {
          fillers.push({
            category: cat,
            questionText: `[Practice] ${cat} - Comprehensive Study Question #${currentCount + i + 1}`,
            options: ["Correct Option", "Alternative A", "Alternative B", "Alternative C"],
            correctAnswer: 0,
            difficulty: "Medium",
            explanation: `This is a practice question to help you master ${cat}. Review your curriculum for detailed study.`
          });
        }
        
        if (fillers.length > 0) {
          await Question.insertMany(fillers);
          console.log(`✅ Filled [${cat}] to ${target} questions.`);
        }
      } else {
        console.log(`✅ Category [${cat}] is already full (${currentCount} questions).`);
      }
    }

  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    process.exit(0);
  }
}

seed();
