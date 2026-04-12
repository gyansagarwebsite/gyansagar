import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminMaterials from './admin/pages/AdminMaterials';
import AddMaterial from './admin/pages/AddMaterial';
import EditMaterial from './admin/pages/EditMaterial';
import AdminBlogs from './admin/pages/AdminBlogs';
import AddBlog from './admin/pages/AddBlog';
import EditBlog from './admin/pages/EditBlog';
import AdminMessages from './admin/pages/AdminMessages';
import WeeklyQuizManager from './admin/pages/WeeklyQuizManager';
import DailyQuestionManager from './admin/pages/DailyQuestionManager';
import AdminContactSettings from './admin/pages/AdminContactSettings';
import AdminHeroSettings from './admin/pages/AdminHeroSettings';
import ManageQuestions from './admin/pages/ManageQuestions';
import './styles/design-system.css';
import './styles/globals.css';
import './styles/variables.css';
import './styles/animations.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Navbar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="materials" element={<AdminMaterials />} />
          <Route path="materials/add" element={<AddMaterial />} />
          <Route path="materials/edit/:id" element={<EditMaterial />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="blogs/add" element={<AddBlog />} />
          <Route path="blogs/edit/:slug" element={<EditBlog />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="daily-question" element={<DailyQuestionManager />} />
          <Route path="weekly-quiz" element={<WeeklyQuizManager />} />
          <Route path="mcqs" element={<ManageQuestions />} />
          <Route path="contact-settings" element={<AdminContactSettings />} />
          <Route path="hero-settings" element={<AdminHeroSettings />} />
        </Route>
      </Routes>
      <Analytics />
    </Router>
  );
}


export default App;
