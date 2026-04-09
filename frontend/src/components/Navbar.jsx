import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, Home, FileText, BookOpen, HelpCircle, Loader2, Clock } from 'lucide-react';
import questionService from '../services/questionService.js';
import notificationService from '../services/notificationService.js';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Scroll effect for sticky glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (!isAdminPath) {
      fetchNotifications();
      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAdminPath]);

  // Handle outside click for notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notif-wrapper')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationService.markAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setShowNotifications(false);
      navigate(notification.link);
    } catch (err) {
      console.error('Failed to handle notification click:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Live Search Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          setIsSearching(true);
          const { questions } = await questionService.getQuestions({ search: searchQuery, limit: 8 });
          setSearchResults(questions);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = () => {
    setSearchResults([]);
    setSearchQuery('');
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  if (isAdminPath) return null;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/materials', label: 'Materials' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/quiz', label: 'Quiz' }
  ];

  const bottomNavLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/quiz', label: 'Quiz', icon: HelpCircle },
    { path: '/materials', label: 'Materials', icon: FileText },
    { path: '/blogs', label: 'Blogs', icon: BookOpen }
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="Gyan Sagar Loksewa & GK Logo"
              className="nav-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span className="nav-brand-name">
              <span className="brand-text-primary">Gyan</span> <span className="nav-brand-accent">Sagar</span>
            </span>
            <span className="nav-logo-fallback" style={{ display: 'none' }}>
              <span className="logo-emoji">📚</span>
              <span className="logo-text-group">
                <span className="logo-name">Loksewa</span>
                <span className="logo-gk">GK</span>
              </span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="nav-search desktop-only">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search Questions..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Desktop Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((q) => (
                  <Link
                    key={q._id}
                    to={`/question/${q.slug || q._id}`}
                    className="search-result-item"
                    onClick={handleResultClick}
                  >
                    <HelpCircle size={14} className="result-icon" />
                    <span className="result-text">{q.questionText}</span>
                  </Link>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="search-loader">
                <Loader2 size={16} className="animate-spin" />
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <ul className="nav-menu desktop-only">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="nav-actions">
            {/* Mobile Search Toggle */}
            <button
              className="nav-icon-btn mobile-only"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* Notification Bell */}
            <div className="notif-wrapper">
              <button 
                className={`nav-icon-btn ${showNotifications ? 'active' : ''}`} 
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={22} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="mark-all-btn" onClick={handleMarkAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <div className="notif-icon-circle">
                            {notif.type === 'blog' && <BookOpen size={16} />}
                            {notif.type === 'material' && <FileText size={16} />}
                            {notif.type === 'quiz' && <HelpCircle size={16} />}
                            {notif.type === 'question' && <Clock size={16} />}
                          </div>
                          <div className="notif-content">
                            <p className="notif-title">{notif.title}</p>
                            <p className="notif-message">{notif.message}</p>
                            <span className="notif-time">{formatTime(notif.createdAt)}</span>
                          </div>
                          {!notif.isRead && <span className="unread-dot"></span>}
                        </div>
                      ))
                    ) : (
                      <div className="notif-empty">
                        <Bell size={40} className="empty-icon" />
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="notif-footer">
                    <span>Recent Updates</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="nav-icon-btn mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search */}
        <div className={`mobile-search-bar ${searchOpen ? 'open' : ''}`}>
          <div className="mobile-search-inner">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search questions, topics..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={searchOpen}
            />
            <button onClick={() => {setSearchOpen(false); setSearchResults([]);}} className="search-close">
              <X size={18} />
            </button>
            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div className="mobile-search-results">
                {searchResults.map((q) => (
                  <Link
                    key={q._id}
                    to={`/question/${q.slug || q._id}`}
                    className="mobile-result-item"
                    onClick={handleResultClick}
                  >
                    <span className="mobile-result-text">{q.questionText}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <div className={`mobile-slide-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav mobile-only">
        {bottomNavLinks.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`bottom-nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={22} className="bottom-nav-icon" />
            <span className="bottom-nav-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
