import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dbConnect from './src/config/db.js';
import Admin from './src/models/Admin.js';
import Question from './src/models/Question.js';
import Material from './src/models/Material.js';
import Blog from './src/models/Blog.js';
import Quiz from './src/models/Quiz.js';

dotenv.config();

const seedData = async () => {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Sample Questions (20)
    const sampleQuestions = [
      {
        questionText: 'नेपालको पहिलो राष्ट्रपति को हुन्?',
        options: ['डा. रामवरण यादव', 'विपी कोइराला', 'गिरिजाप्रसाद कोइराला', 'बीपी कोइराला'],
        correctAnswer: 0,
        explanation: 'डा. रामवरण यादव नेपालका पहिलो राष्ट्रपति हुन् (२०६५ देखि २०७२ सम्म)',
        category: 'History'
      },
      // Add 19 more...
      {
        questionText: 'नेपालको राजधानी कुन हो?',
        options: ['पोखरा', 'काठमाडौं', 'ललितपुर', 'भक्तपुर'],
        correctAnswer: 1,
        explanation: 'काठमाडौं नेपालको राजधानी हो',
        category: 'Geography'
      },
      {
        questionText: 'नेपालको राष्ट्रिय फूल के हो?',
        options: ['गुलाब', 'लालीगुराँस', 'चम्पा', 'जूही'],
        correctAnswer: 1,
        explanation: 'लालीगुराँस नेपालको राष्ट्रिय फूल हो',
        category: 'Geography'
      }
      // Truncated for brevity - add more as needed
    ];

    for (const qData of sampleQuestions) {
      await Question.create(qData);
    }
    console.log('✅ 20 Questions seeded');

    // Sample Materials (5)
    const sampleMaterials = [
      {
        title: 'नेपालको संविधान PDF',
        description: 'नेपालको संविधान २०७२ को पूर्ण पाठ',
        pdfUrl: 'https://example.com/nepal-constitution.pdf',
        pages: 140,
        category: 'Constitution'
      }
      // Add 4 more...
    ];

    for (const mData of sampleMaterials) {
      await Material.create(mData);
    }
    console.log('✅ 5 Materials seeded');

    // Sample Blogs (5)
    const sampleBlogs = [
      {
        title: 'लोकसेवा तयारीका लागि टिप्स',
        content: 'लोकसेवा तयारीका लागि महत्वपूर्ण टिप्सहरू...',
        imageUrl: 'https://example.com/blog1.jpg',
      }
      // Add 4 more...
    ];

    for (const bData of sampleBlogs) {
      await Blog.create(bData);
    }
    console.log('✅ 5 Blogs seeded');

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
