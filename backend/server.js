import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';
import materialRoutes from './src/routes/materialRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import weeklyQuizRoutes from './src/routes/weeklyQuizRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import heroRoutes from './src/routes/heroRoutes.js';
import contactSettingsRoutes from './src/routes/contactSettingsRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

import { errorHandler } from './src/middleware/errorMiddleware.js';
import dbConnect from './src/config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup custom DNS before mongoose
import './src/utils/dnsSetup.js';

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

app.use('/api/questions', questionRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/weekly-quiz', weeklyQuizRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/contact-settings', contactSettingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/materials/files', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await dbConnect();
    console.log('✅ MongoDB Connected successfully');
  } catch (error) {
    console.error('⚠️  DB connection failed but server continues running:', error.message);
  }
});
