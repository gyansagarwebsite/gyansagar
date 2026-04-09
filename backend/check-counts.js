import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const categories = [
      'History', 'Geography', 'Science', 'Current Affairs', 'Constitution', 
      'World GK', 'Mathematics', 'GK', 'Loksewa', 'Literature', 'Computer', 'Sport', 'Other',
      'Nepal Electricity', 'Computer Operator', 'Banking Sector', 'नेपाल स्वास्थ्य', 
      'Nepal Police', 'Nepal Army'
    ];

    console.log('--- Category Counts ---');
    for (const cat of categories) {
      const count = await Question.countDocuments({ category: cat });
      console.log(`${cat}: ${count}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCategories();
