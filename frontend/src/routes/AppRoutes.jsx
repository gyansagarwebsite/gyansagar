import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import QuestionDetails from '../pages/QuestionDetails';
import MaterialsPage from '../pages/MaterialsPage';
import BlogsPage from '../pages/BlogsPage';
import BlogDetails from '../pages/BlogDetails';
import QuizPage from '../pages/QuizPage';
import AdminContactSettings from '../admin/pages/AdminContactSettings.jsx';
import AdminLayout from '../admin/AdminLayout.jsx';
import AdminLogin from '../admin/pages/AdminLogin.jsx';
import AdminDashboard from '../admin/pages/AdminDashboard.jsx';
import AdminBlogs from '../admin/pages/AdminBlogs.jsx';
import AddBlog from '../admin/pages/AddBlog.jsx';
import EditBlog from '../admin/pages/EditBlog.jsx';
import AdminMaterials from '../admin/pages/AdminMaterials.jsx';
import AdminMessages from '../admin/pages/AdminMessages.jsx';
import AdminHeroSettings from '../admin/pages/AdminHeroSettings.jsx';
import WeeklyQuizManager from '../admin/pages/WeeklyQuizManager.jsx';
import DailyQuestionManager from '../admin/pages/DailyQuestionManager.jsx';
import ManageQuestions from '../admin/pages/ManageQuestions.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        style={{ minHeight: 'calc(100vh - 60px)' }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/question/:slug" element={<QuestionDetails />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/materials/:id" element={<MaterialsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/quiz" element={<QuizPage />} />


          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="login" element={<AdminLogin />} />
            <Route index element={<AdminDashboard />} />

            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/add" element={<AddBlog />} />
            <Route path="blogs/edit/:slug" element={<EditBlog />} />
            <Route path="materials" element={<AdminMaterials />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="contact-settings" element={<AdminContactSettings />} />
            <Route path="hero-settings" element={<AdminHeroSettings />} />
            <Route path="daily-question" element={<DailyQuestionManager />} />
            <Route path="weekly-quiz" element={<WeeklyQuizManager />} />
            <Route path="mcqs" element={<ManageQuestions />} />
            <Route path="*" element={<div style={{ padding: '50px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', margin: '20px' }}>ROUTE NOT FOUND IN ADMIN LAYOUT</div>} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
