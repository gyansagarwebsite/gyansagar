import Blog from '../models/Blog.js';
import { createNotification } from './notificationController.js';

export const getBlogs = async (req, res) => {
  try {
    const search = req.query.q?.trim();
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlog = async (req, res) => {
  try {
const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();

    // Create notification
    await createNotification({
      title: 'New Blog Post',
      message: `New article: ${blog.title}`,
      type: 'blog',
      link: `/blogs/${blog.slug}`,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedPremiumBlogs = async (req, res) => {
  try {
    const professionalBlogs = [
      {
        title: "Loksewa Preparation: A Comprehensive Guide for 2024",
        slug: "loksewa-preparation-guide-2024",
        content: `<h2>Success in Loksewa is not just about hard work; it's about smart work.</h2><p>Preparing for the Public Service Commission (PSC) exams in Nepal requires a disciplined approach and a clear understanding of the syllabus. In this guide, we break down the essential steps to kickstart your journey.</p><h3>1. Understand the Syllabus</h3><p>Before diving into books, print out the latest syllabus for Kharidar, Nasu, or Officer levels. Focus on the weightage given to each section.</p><h3>2. Quality over Quantity</h3><p>Instead of reading ten different books, read one high-quality book ten times. Consistency is key.</p><h3>3. Daily Current Affairs</h3><p>Stay updated with national and international news. Gyan Sagar's daily quiz section is a great place to start.</p>`,
        excerpt: "Everything you need to know to start your Loksewa preparation journey with confidence and a clear roadmap.",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
        category: "Preparation Tips",
        author: "Gyan Sagar Expert Team"
      },
      {
        title: "Mastering Current Affairs: Strategies that Work",
        slug: "mastering-current-affairs-strategies",
        content: `<h2>Current Affairs can make or break your score.</h2><p>Many candidates struggle with the vastness of current events. Here is how you can master this section efficiently.</p><h3>The Rule of 3 Months</h3><p>Most questions focus on events from the last 3-6 months. Focus your energy here.</p><h3>Categorization</h3><p>Divide your notes into Politics, Economy, Sports, and International Relations. This makes revision much faster.</p>`,
        excerpt: "Stop feeling overwhelmed by the news. Learn the exact strategy to filter and retain important current affairs.",
        imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
        category: "Current Affairs",
        author: "Sanjeev Sharma"
      },
      {
        title: "The Art of Time Management during Competitive Exams",
        slug: "time-management-loksewa-exams",
        content: `<h2>Time is your most valuable resource in the exam hall.</h2><p>Technical knowledge is useless if you can't manage your time to answer all questions. Let's look at the 'Round Method' of solving papers.</p><h3>The Three-Round Strategy</h3><p>Round 1: Answer questions you are 100% sure about. Round 2: Tackle questions where you can eliminate two options. Round 3: Solve the difficult ones if time permits.</p>`,
        excerpt: "Learn the 'Three-Round Strategy' to ensure you never leave a marks-earning question unattempted again.",
        imageUrl: "https://images.unsplash.com/photo-1508962914676-13483df50268?q=80&w=800&auto=format&fit=crop",
        category: "Soft Skills",
        author: "Gyan Sagar Mentor"
      },
      {
        title: "Understanding the New Syllabus for Kharidar and Nasu",
        slug: "kharidar-nasu-new-syllabus-analysis",
        content: `<h2>The PSC has updated several sections recently. Are you prepared?</h2><p>Staying updated with syllabus changes is crucial. We analyze the latest shifts in the second and third papers of the non-technical sections.</p><h3>Focus on Governance</h3><p>There is a growing emphasis on federalism and local governance structures. Make sure your notes reflect the current political map and local body powers.</p>`,
        excerpt: "A deep dive into the recent syllabus updates for non-technical posts to keep your preparation relevant.",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
        category: "Syllabus Analysis",
        author: "Admin"
      },
      {
        title: "Top 50 Most Frequently Asked GK Questions",
        slug: "top-50-frequent-gk-questions",
        content: `<h2>Don't miss out on these 'Sure Shot' marks.</h2><p>Analysis of the last 10 years of Loksewa papers shows that certain General Knowledge topics repeat frequently. We have compiled the top 50 topics you must memorize.</p><h3>Geography of Nepal</h3><p>Rivers, mountains, and administrative divisions are non-negotiable. Learn them by heart.</p>`,
        excerpt: "Based on 10 years of exam analysis, we've compiled the high-yield GK topics that repeat year after year.",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
        category: "General Knowledge",
        author: "GK Specialist"
      },
      {
        title: "How to Write Impactful Answers in Subjective Papers",
        slug: "impactful-subjective-answer-writing",
        content: `<h2>The examiner reads hundreds of papers. Make yours stand out.</h2><p>Writing for Loksewa is different from writing for university exams. It requires precision, points, and relevant data.</p><h3>Use Bullet Points</h3><p>Avoid long paragraphs. Use clear headings and bullet points to make your answer easy to scan for the examiner.</p><p>Always conclude with a positive, forward-looking summary.</p>`,
        excerpt: "Transform your writing style from average to exceptional with these examiner-approved formatting tips.",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
        category: "Writing Skills",
        author: "Former PSC Examiner"
      }
    ];

    await Blog.deleteMany({});
    await Blog.insertMany(professionalBlogs);
    res.json({ message: "6 Professional blogs seeded successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
