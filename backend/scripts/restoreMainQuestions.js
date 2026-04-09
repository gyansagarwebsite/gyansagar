import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../src/models/Question.js';
import connectDB from '../src/config/db.js';
import { REAL_LOKSEWA_DATA } from './real-loksewa-data.js';
import '../src/utils/dnsSetup.js';

dotenv.config({ path: './backend/.env' });

const restoreQuestions = async () => {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Optional: Clear existing questions to prevent duplicates
        console.log('🧹 Purging existing questions...');
        await Question.deleteMany({});

        console.log(`🚀 Processing ${REAL_LOKSEWA_DATA.length} questions...`);

        const processedQuestions = REAL_LOKSEWA_DATA.map(q => ({
            ...q,
            // Generate a slug if missing
            slug: q.questionText.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 7)
        }));

        await Question.insertMany(processedQuestions);
        console.log(`🎉 Successfully restored ${processedQuestions.length} real Loksewa questions!`);

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Restoration failed:', err);
        process.exit(1);
    }
};

restoreQuestions();
