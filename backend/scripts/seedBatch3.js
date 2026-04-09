import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../src/utils/dnsSetup.js';
import Question from '../src/models/Question.js';
import dbConnect from '../src/config/db.js';

dotenv.config();

const questions = [
  // --- WORLD GEOGRAPHY ---
  {
    questionText: 'Which is the largest ocean in the world?',
    options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
    correctAnswer: 0,
    category: 'World GK',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the smallest continent by land area?',
    options: ['Australia', 'Europe', 'Antarctica', 'South America'],
    correctAnswer: 0,
    category: 'World GK',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the longest river in the world?',
    options: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'],
    correctAnswer: 0,
    category: 'World GK',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which country is known as the "Land of the Rising Sun"?',
    options: ['Japan', 'China', 'Norway', 'Australia'],
    correctAnswer: 0,
    category: 'World GK',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the deepest point in the world\'s oceans?',
    options: ['Mariana Trench', 'Tonga Trench', 'Java Trench', 'Philippine Trench'],
    correctAnswer: 0,
    category: 'World GK',
    difficulty: 'Medium'
  },

  // --- NEPALI LITERATURE ---
  {
    questionText: 'Who is known as the "Aadi Kavi" of Nepal?',
    options: ['Bhanubhakta Acharya', 'Laxmi Prasad Devkota', 'Motiram Bhatta', 'Lekhnath Paudyal'],
    correctAnswer: 0,
    category: 'Literature',
    difficulty: 'Easy'
  },
  {
    questionText: 'Who wrote the famous epic "Muna Madan"?',
    options: ['Laxmi Prasad Devkota', 'Balkrishna Sama', 'Madhav Prasad Ghimire', 'Bhanubhakta Acharya'],
    correctAnswer: 0,
    category: 'Literature',
    difficulty: 'Easy'
  },
  {
    questionText: 'Who is known as the "Rashtra Kavi" of Nepal?',
    options: ['Madhav Prasad Ghimire', 'Laxmi Prasad Devkota', 'Lekhnath Paudyal', 'Siddhicharan Shrestha'],
    correctAnswer: 0,
    category: 'Literature',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which was the first daily newspaper published in Nepal?',
    options: ['Gorkhapatra', 'The Rising Nepal', 'Kantipur', 'Samacharpatra'],
    correctAnswer: 0,
    category: 'Literature',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who is the author of "Seto Dharti"?',
    options: ['Amar Neupane', 'Jhamak Ghimire', 'Narayan Wagle', 'Bp Koirala'],
    correctAnswer: 0,
    category: 'Literature',
    difficulty: 'Hard'
  },

  // --- CURRENT AFFAIRS ---
  {
    questionText: 'Who is the current Prime Minister of Nepal (as of mid-2080 BS)?',
    options: ['Pushpa Kamal Dahal (Prachanda)', 'Sher Bahadur Deuba', 'KP Sharma Oli', 'Madhav Kumar Nepal'],
    correctAnswer: 0,
    category: 'Current Affairs',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which country won the ICC Men\'s T20 World Cup 2024?',
    options: ['India', 'South Africa', 'Australia', 'England'],
    correctAnswer: 0,
    category: 'Sport',
    difficulty: 'Easy'
  },
  {
    questionText: 'In which year did Nepal become a Federal Democratic Republic?',
    options: ['2065 Jestha 15', '2063 Baishak 11', '2072 Ashwin 3', '2046 Chaitra 26'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Medium'
  },

  // --- MORE COMPUTER OPERATOR ---
  {
    questionText: 'What is the keyboard shortcut for "Undo" operation?',
    options: ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + X', 'Ctrl + C'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which of the following is not an output device?',
    options: ['Scanner', 'Monitor', 'Printer', 'Speaker'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  }
];

const seedBatch3 = async () => {
  try {
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    const processedQuestions = questions.map(q => ({
      ...q,
      slug: q.questionText.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 50)
    }));

    await Question.insertMany(processedQuestions);
    console.log(`🚀 Successfully seeded ${processedQuestions.length} more real Loksewa questions (Batch 3)!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions (Batch 3):', error.message);
    process.exit(1);
  }
};

seedBatch3();
