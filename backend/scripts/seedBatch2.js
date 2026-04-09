import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../src/utils/dnsSetup.js';
import Question from '../src/models/Question.js';
import dbConnect from '../src/config/db.js';

dotenv.config();

const questions = [
  // --- GEOGRAPHY ---
  {
    questionText: 'What is the total area of Nepal including the updated map with Limpiyadhura?',
    options: ['147,181 sq km', '147,516 sq km', '147,984 sq km', '148,000 sq km'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the largest district of Nepal by area?',
    options: ['Dolpa', 'Humla', 'Mustang', 'Taplejung'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the deepest river of Nepal?',
    options: ['Gandaki', 'Koshi', 'Karnali', 'Bagmati'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'Medium'
  },
  {
    questionText: 'How many districts are there in Province No. 1 (Koshi Province)?',
    options: ['14', '12', '10', '13'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which mountain is known as the "Killer Mountain"?',
    options: ['Manaslu', 'Annapurna', 'Dhaulagiri', 'Everest'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the percentage of total land area of Nepal covered by mountains?',
    options: ['15%', '68%', '17%', '35%'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which is the smallest district of Nepal?',
    options: ['Bhaktapur', 'Lalitpur', 'Kathmandu', 'Parbat'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Easy'
  },
  {
    questionText: 'Rara Lake is situated in which district?',
    options: ['Mugu', 'Dolpa', 'Humla', 'Jumla'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which river is known as the "Sorrow of Bihar"?',
    options: ['Koshi', 'Gandaki', 'Karnali', 'Mechi'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the average width of Nepal from North to South?',
    options: ['193 km', '241 km', '145 km', '885 km'],
    correctAnswer: 0,
    category: 'Geography',
    difficulty: 'Medium'
  },

  // --- CONSTITUTION ---
  {
    questionText: 'When was the current Constitution of Nepal promulgated?',
    options: ['Ashwin 3, 2072 BS', 'Bhadra 1, 2072 BS', 'Asoj 1, 2071 BS', 'Magh 5, 2072 BS'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Easy'
  },
  {
    questionText: 'How many parts are there in the current Constitution of Nepal?',
    options: ['35 parts', '25 parts', '30 parts', '40 parts'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Medium'
  },
  {
    questionText: 'How many articles are there in the Constitution of Nepal (2072)?',
    options: ['308 articles', '295 articles', '315 articles', '300 articles'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Medium'
  },
  {
    questionText: 'How many schedules (Anusuchi) are there in the Constitution?',
    options: ['9 schedules', '7 schedules', '12 schedules', '5 schedules'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which article of the Constitution defines the "Preamble"?',
    options: ['Article 1', 'Article 2', 'Preamble is separate', 'Article 5'],
    correctAnswer: 2,
    category: 'Constitution',
    difficulty: 'Medium'
  },
  {
    questionText: 'How many fundamental rights are mentioned in the Constitution?',
    options: ['31', '21', '25', '19'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Easy'
  },
  {
    questionText: 'Right to Education is mentioned in which article?',
    options: ['Article 31', 'Article 25', 'Article 18', 'Article 35'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Hard'
  },
  {
    questionText: 'Who is the guardian of the Constitution according to its provisions?',
    options: ['The Supreme Court', 'The President', 'The Prime Minister', 'The Parliament'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the term of office for the members of the National Assembly?',
    options: ['6 years', '5 years', '4 years', '2 years'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which language is the official language of Nepal per the Constitution?',
    options: ['Nepali in Devanagari script', 'Nepali and English', 'All mother tongues', 'Nepali and Maithili'],
    correctAnswer: 0,
    category: 'Constitution',
    difficulty: 'Easy'
  },

  // --- SCIENCE (General Science for Loksewa) ---
  {
    questionText: 'What is the chemical formula of common salt?',
    options: ['NaCl', 'KCl', 'MgCl2', 'CaCl2'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which planet is known as the "Red Planet"?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the speed of light in vacuum?',
    options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who discovered the Law of Gravitation?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Marie Curie'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which gas is most abundant in the Earth\'s atmosphere?',
    options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Argon'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the unit of power?',
    options: ['Watt', 'Joule', 'Newton', 'Ampere'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which Vitamin is synthesized by the human body in the presence of sunlight?',
    options: ['Vitamin D', 'Vitamin A', 'Vitamin C', 'Vitamin K'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'The process of conversion of solid directly into gas is called:',
    options: ['Sublimation', 'Evaporation', 'Condensation', 'Fusion'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the pH value of pure water?',
    options: ['7', '0', '14', '5'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which instrument is used to measure humidity?',
    options: ['Hygrometer', 'Barometer', 'Thermometer', 'Hydrometer'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'Medium'
  }
];

const seedBatch2 = async () => {
  try {
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    const processedQuestions = questions.map(q => ({
      ...q,
      slug: q.questionText.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 50)
    }));

    await Question.insertMany(processedQuestions);
    console.log(`🚀 Successfully seeded ${processedQuestions.length} more real Loksewa questions (Batch 2)!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions (Batch 2):', error.message);
    process.exit(1);
  }
};

seedBatch2();
