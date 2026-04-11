import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FileText, BookOpen, MessageSquare, Trophy, Plus, Activity } from 'lucide-react';
import adminDashboardService from '../services/adminDashboardService.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalMaterials: 0,
    totalBlogs: 0,
    totalMessages: 0,
    weeklyQuizQuestionsCount: 0,
    weeklyQuizAttempts: 0,
    activeQuizStatus: 'draft'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminDashboardService.getStats();

      setStats({
        totalQuestions: data.totalQuestions || 0,
        totalMaterials: data.totalMaterials || 0,
        totalBlogs: data.totalBlogs || 0,
        totalMessages: data.totalMessages || 0,
        weeklyQuizQuestionsCount: data.weeklyQuiz?.questionsCount || 0,
        weeklyQuizAttempts: data.weeklyQuiz?.attemptsCount || 0,
        activeQuizStatus: data.weeklyQuiz?.status || 'draft'
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Gyan Sagar Admin Panel</p>
      </div>

      <div className="stats-grid">

        <DashboardCard 
          icon={<BookOpen size={32} />}
          title="Study Materials" 
          value={stats.totalMaterials.toLocaleString()}
          trend={8}
          subsidiary="Total files"
        />
        <DashboardCard 
          icon={<FileText size={32} />}
          title="Published Blogs" 
          value={stats.totalBlogs.toLocaleString()}
          trend={5}
          subsidiary="Total posts"
        />
        <DashboardCard 
          icon={<MessageSquare size={32} />}
          title="New Messages" 
          value={stats.totalMessages.toLocaleString()}
          trend={stats.totalMessages > 0 ? 3 : 0}
          subsidiary="Contact form"
        />
        <DashboardCard 
          icon={<Trophy size={32} />}
          title="Weekly Quiz" 
          value={`${stats.weeklyQuizQuestionsCount}/15`}
          subsidiary={stats.activeQuizStatus === 'active' ? 'Active' : 'Draft'}
        />
        <DashboardCard 
          icon={<Activity size={32} />}
          title="Weekly Attempts" 
          value={stats.weeklyQuizAttempts.toLocaleString()}
          subsidiary="This week"
        />
      </div>

      <div className="quick-actions">

        <Link to="/admin/daily-question" className="action-btn" style={{ background: 'var(--primary-color)'}}>
          <Plus size={18} /> Add Question
        </Link>
        <Link to="/admin/materials/add" className="action-btn">
          <Plus size={18} /> Upload Material
        </Link>
        <Link to="/admin/blogs/add" className="action-btn">
          <Plus size={18} /> Write Blog
        </Link>
        <Link to="/admin/weekly-quiz" className="action-btn secondary">
          <Trophy size={18} /> Manage Quiz
        </Link>
      </div>

      <div className="dashboard-links">

        <Link to="/admin/daily-question" className="dashboard-link">
          <h3>Manage Questions</h3>
          <p>Add, edit, delete daily questions</p>
        </Link>
        <Link to="/admin/materials" className="dashboard-link">
          <h3>Manage Materials</h3>
          <p>Upload and manage study materials</p>
        </Link>
        <Link to="/admin/blogs" className="dashboard-link">
          <h3>Manage Blogs</h3>
          <p>Create and publish blog posts</p>
        </Link>
        <Link to="/admin/messages" className="dashboard-link">
          <h3>Messages</h3>
          <p>View contact form submissions</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

