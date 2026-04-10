import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, BookOpen, PenTool, BarChart3, MessageSquare, LogOut, X, Calendar, Settings } from 'lucide-react';
import authService from '../services/authService.js';
import './AdminDrawer.css';

const AdminDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      window.location.href = '/admin/login';
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },

    {
      label: 'Materials',
      path: '/admin/materials',
      icon: BookOpen
    },
    {
      label: 'Blogs',
      path: '/admin/blogs',
      icon: PenTool
    },
    {
      label: 'Weekly Quiz',
      path: '/admin/weekly-quiz',
      icon: BarChart3
    },
    {
      label: 'Manage MCQs',
      path: '/admin/mcqs',
      icon: HelpCircle
    },

    {
      label: 'Contact Settings',
      path: '/admin/contact-settings',
      icon: Settings
    },
    {
      label: 'Messages',
      path: '/admin/messages',
      icon: MessageSquare
    }
  ];

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={`admin-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <h2>Gyan Sagar</h2>
            <p>Admin</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close drawer">
            <X size={24} />
          </button>
        </div>

        <nav className="drawer-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={onClose}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
                {active && <div className="nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="drawer-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminDrawer;

