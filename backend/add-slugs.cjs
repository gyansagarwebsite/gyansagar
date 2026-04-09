const mongoose = require('mongoose');
const slugify = require('slugify');
require('dotenv').config({ path: './.env' });

// Define schema inline to avoid import issues
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  slug: { type: String },
  imageUrl: { type: String, default: null },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' },
  category: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

const uri = 'mongodb+srv://gyansagarwebsite:gyansagar117@gyansagar.cbjzxl5.mongodb.net/?appName=gyansagar';

mongoose.connect(uri).then(async () => {
  console.log('Connected to MongoDB');
  
  // Find all questions without slug
  const questionsWithoutSlug = await Question.find({ slug: { $exists: false } });
  console.log(`Found ${questionsWithoutSlug.length} questions without slug`);
  
  // Update each question with a slug
  for (const q of questionsWithoutSlug) {
    const slug = slugify(q.questionText, { lower: true, strict: true });
    await Question.findByIdAndUpdate(q._id, { slug });
    console.log(`Updated: ${q.questionText.substring(0, 30)}... -> ${slug}`);
  }
  
  // Also check for empty slugs
  const questionsWithEmptySlug = await Question.find({ slug: '' });
  console.log(`Found ${questionsWithEmptySlug.length} questions with empty slug`);
  
  for (const q of questionsWithEmptySlug) {
    const slug = slugify(q.questionText, { lower: true, strict: true });
    await Question.findByIdAndUpdate(q._id, { slug });
    console.log(`Updated: ${q.questionText.substring(0, 30)}... -> ${slug}`);
  }
  
  console.log('Done!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
