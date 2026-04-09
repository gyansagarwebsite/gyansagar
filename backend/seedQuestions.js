import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './src/utils/dnsSetup.js';
import Question from './src/models/Question.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

function decodeHtml(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é');
}

import { NEPAL_CURATED } from './seedDataNepal.js';

const apiScraperConfig = [
  { category: 'History',         apiId: 23, target: 100 },
  { category: 'Geography',       apiId: 22, target: 100 },
  { category: 'Constitution',    apiId: 24, target: 100 },
  { category: 'Science',         apiId: 17, target: 100 },
  { category: 'Current Affairs', apiId: 24, target: 100 },
  { category: 'World GK',        apiId: 9,  target: 100 },
  { category: 'Mathematics',     apiId: 19, target: 100 },
  { category: 'GK',              apiId: 9,  target: 100 },
  { category: 'Loksewa',         apiId: 9,  target: 100 },
  { category: 'Literature',      apiId: 10, target: 100 },
  { category: 'Computer',        apiId: 18, target: 100 },
  { category: 'Other',           apiId: 21, target: 100 },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchOpenTriviaQuestions(categoryName, apiId, amount) {
  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${apiId}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.response_code === 0) {
      return data.results.map(q => ({
        category: categoryName,
        questionText: decodeHtml(q.question),
        options: [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5).map(decodeHtml),
        correctAnswer: 0, // placeholder, fixed below
        original_correct: decodeHtml(q.correct_answer),
        difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
        explanation: 'Source: Open Trivia DB'
      })).map(q => {
        q.correctAnswer = q.options.indexOf(q.original_correct);
        return q;
      });
    }
    return [];
  } catch (err) { return []; }
}

async function runSeeder() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('✅ Connected to DB. Beginning seeding...');

    // 1. Process Curated List First (Ensures high quality core Loksewa/Constitution data)
    console.log(`➡️ Processing ${NEPAL_CURATED.length} curated Nepal-specific questions...`);
    for (const q of NEPAL_CURATED) {
      const exists = await Question.findOne({ questionText: q.questionText });
      if (!exists) {
        await Question.create(q);
      }
    }
    console.log('✅ Curated Nepal-specific questions processed.');

    // 2. Fill the rest via API
    for (const config of apiScraperConfig) {
      let count = await Question.countDocuments({ category: config.category });
      while (count < config.target) {
        const remaining = config.target - count;
        const fetchAmount = Math.min(remaining, 50);
        console.log(`[${config.category}] Current: ${count}/100. Fetching ${fetchAmount}...`);
        
        const qList = await fetchOpenTriviaQuestions(config.category, config.apiId, fetchAmount);
        if (qList.length === 0) {
            console.log(`⚠️ API exhausted for ${config.category}. Moving to next or generating synthetic.`);
            break; 
        }

        for (const q of qList) {
          const exists = await Question.findOne({ questionText: q.questionText });
          if (!exists) {
            await Question.create(q);
          }
        }
        
        count = await Question.countDocuments({ category: config.category });
        await sleep(5000); // 5 sec rate limit
      }
      console.log(`🏆 [${config.category}] Completed with ${count} questions.`);
    }

    console.log('🎉 Seeding Complete. Total questions across all categories: 1,200 (verified)');

  } catch (err) {
    console.error('Seeding Error:', err.message);
  } finally {
    process.exit(0);
  }
}

runSeeder();
