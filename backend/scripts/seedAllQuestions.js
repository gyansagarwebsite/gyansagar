import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// DNS Patch
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
console.log('🚀 DNS Patch applied.');

// Import models
import Question from '../src/models/Question.js';

// Import data from category files
import { HISTORY_QUESTIONS } from './questions/History.js';
import { GEOGRAPHY_QUESTIONS } from './questions/Geography.js';
import { CONSTITUTION_QUESTIONS } from './questions/Constitution.js';
import { SCIENCE_QUESTIONS } from './questions/Science.js';
import { COMPUTER_OPERATOR_QUESTIONS } from './questions/ComputerOperator.js';
import { BANKING_SECTOR_QUESTIONS } from './questions/BankingSector.js';
import { ARMY_QUESTIONS } from './questions/Army.js';
import { POLICE_QUESTIONS } from './questions/Police.js';
import { ELECTRICITY_QUESTIONS } from './questions/Electricity.js';
import { HEALTH_QUESTIONS } from './questions/Health.js';
import { CURRENT_AFFAIRS_QUESTIONS } from './questions/CurrentAffairs.js';
import { LOKSEWA_QUESTIONS } from './questions/Loksewa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const ALL_QUESTIONS = [
  ...HISTORY_QUESTIONS,
  ...GEOGRAPHY_QUESTIONS,
  ...CONSTITUTION_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...COMPUTER_OPERATOR_QUESTIONS,
  ...BANKING_SECTOR_QUESTIONS,
  ...ARMY_QUESTIONS,
  ...POLICE_QUESTIONS,
  ...ELECTRICITY_QUESTIONS,
  ...HEALTH_QUESTIONS,
  ...CURRENT_AFFAIRS_QUESTIONS,
  ...LOKSEWA_QUESTIONS
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully.');

    // Optional: Clear existing questions to avoid duplicates and ensure clean seeding
    // WARNING: This will remove all existing questions!
    // console.log('Clearing existing questions...');
    // await Question.deleteMany({});
    // console.log('Cleared existing questions.');

    console.log(`Starting to seed ${ALL_QUESTIONS.length} questions...`);

    let successCount = 0;
    let failCount = 0;
    let duplicateCount = 0;

    for (const qData of ALL_QUESTIONS) {
      try {
        // Double check if question exists to avoid duplicate errors
        const exists = await Question.findOne({ questionText: qData.questionText });
        if (exists) {
          duplicateCount++;
          continue;
        }

        await Question.create(qData);
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Progress: ${successCount} questions seeded...`);
        }
      } catch (err) {
        failCount++;
        console.error(`Failed to seed question: ${qData.questionText.substring(0, 30)}...`, err.message);
      }
    }

    console.log('--- Seeding Summary ---');
    console.log(`Total attempted: ${ALL_QUESTIONS.length}`);
    console.log(`Successfully seeded: ${successCount}`);
    console.log(`Skipped (Duplicates): ${duplicateCount}`);
    console.log(`Failed: ${failCount}`);
    console.log('-----------------------');

    process.exit(0);
  } catch (err) {
    console.error('Seeding process failed:', err);
    process.exit(1);
  }
};

seedDB();
