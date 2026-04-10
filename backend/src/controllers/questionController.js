import mongoose from 'mongoose';
import slugify from 'slugify';
import { freshChunk2 } from '../data/freshChunk2.js';
import Question from '../models/Question.js';

/**
 * Transform a question object to the requested language.
 * Falls back to English if Nepali fields are missing/empty.
 */
const mapLang = (q, lang) => {
  const obj = q.toObject ? q.toObject() : { ...q };
  if (lang === 'NP' && obj.questionTextNP && obj.optionsNP && obj.optionsNP.length === 4) {
    return { ...obj, questionText: obj.questionTextNP, options: obj.optionsNP };
  }
  return obj;
};

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, lang } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.questionText = { $regex: search, $options: 'i' };
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Question.countDocuments(query);

    res.json({
      questions: questions.map(q => mapLang(q, lang)),
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single question
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;
    
    // Check if it's a valid ObjectId first
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    let question = null;
    
    if (isValidObjectId) {
      // Try to find by ObjectId first
      question = await Question.findById(id);
    }
    
    // If not found by ObjectId, try to find by slug
    if (!question) {
      question = await Question.findOne({ slug: id });
    }
    
    // If still not found, try to find by slug with regex
    if (!question && !isValidObjectId) {
      question = await Question.findOne({ slug: { $regex: new RegExp(`^${id}$`, 'i') } });
    }
    
    // If question still not found, return 404
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Generate slug if it doesn't exist (for backward compatibility with old questions)
    if (!question.slug) {
      question.slug = slugify(question.questionText, { lower: true, strict: true });
      await question.save();
    }
    
    res.json(mapLang(question, lang));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create question (admin)
export const createQuestion = async (req, res) => {
  try {
    const { questionText } = req.body;
    
    // Check if question already exists (case-insensitive, trimmed)
    const existingQuestion = await Question.findOne({ 
      questionText: { $regex: new RegExp(`^${questionText.trim()}$`, 'i') } 
    });

    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already exists' });
    }

    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Question already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update question (admin)
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    let question;
    if (isValidObjectId) {
      question = await Question.findByIdAndUpdate(id, req.body, { new: true });
    }

    if (!question) {
      question = await Question.findOneAndUpdate({ slug: id }, req.body, {
        new: true,
      });
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete question (admin)
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Copy question (admin)
export const copyQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const sourceQuestion = await Question.findById(id);
    
    if (!sourceQuestion) {
      return res.status(404).json({ message: 'Source question not found' });
    }

    const questionData = sourceQuestion.toObject();
    delete questionData._id;
    delete questionData.createdAt;
    delete questionData.updatedAt;
    questionData.questionText = `${questionData.questionText} (Copy)`;
    
    const newQuestion = new Question(questionData);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recent questions (for quiz picker)
export const getRecentQuestions = async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      const questions = await Question.find({
        createdAt: { $gte: sevenDaysAgo },
      }).sort({ createdAt: -1 });
  
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Append Set 2 questions
export const appendChunk2 = async (req, res) => {
  try {
    const created = await Question.insertMany(freshChunk2);
    res.json({
      message: 'Set 2 questions appended successfully',
      count: created.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk create questions (admin)
export const bulkCreateQuestions = async (req, res) => {
  try {
    const questions = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Payload must be an array of questions' });
    }

    // Sanitize and prepare questions
    const preparedQuestions = questions.map(q => ({
      ...q,
      questionText: q.questionText?.trim(),
      options: q.options ? q.options.map(opt => opt?.trim()) : []
    }));

    // ordered: false allows continuing insertion even if some fail (e.g. duplicate questionText)
    const result = await Question.insertMany(preparedQuestions, { ordered: false });
    
    res.status(201).json({
      success: true,
      message: 'Bulk upload successful',
      count: result.length
    });
  } catch (error) {
    // Check if it's a partially successful insertion (e.g. duplicate key errors)
    if (error.name === 'BulkWriteError' || error.code === 11000 || error.writeErrors) {
      const insertedCount = error.result?.nInserted || 0;
      const errorCount = (error.writeErrors?.length) || (questions.length - insertedCount);
      
      return res.status(207).json({
        success: false,
        message: `Partial success: ${insertedCount} questions added, ${errorCount} failed (likely duplicates).`,
        insertedCount,
        errorCount
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};
