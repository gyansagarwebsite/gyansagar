import { useState, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import authService from '../services/authService.js';
import './AdminHeader.css';

const AdminHeader = ({ onMenuToggle }) => {
  const [adminName, setAdminName] = useState('Admin');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Get admin profile on mount
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile && (profile.email || profile.username)) {
          setAdminName(profile.username || profile.email.split('@')[0]);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <div className="header-brand">
          <h1>Gyan Sagar</h1>
          <span className="brand-subtitle">Admin Panel</span>
        </div>
      </div>

      <div className="admin-header-right">
        <div className="profile-menu-container">
          <button 
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profile menu"
          >
            <div className="avatar">
              <User size={20} />
            </div>
            <span className="admin-name">{adminName}</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="avatar-large">
                  <User size={32} />
                </div>
                <div className="profile-info">
                  <p className="profile-email">{adminName}@gyansagar.com</p>
                  <p className="profile-role">Administrator</p>
                </div>
              </div>
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

