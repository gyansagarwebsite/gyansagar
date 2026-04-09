import { useLocation } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import '../styles/components/Footer.css';

const Footer = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState({
    email: 'support@gyansagar.com',
    phone: '+977 98765 43210',
    address: 'Kathmandu, Nepal'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await settingsService.getContactSettings();
        if (data) {
          setContactInfo({
            email: data.email || 'support@gyansagar.com',
            phone: data.phone || '+977 98765 43210',
            address: data.address || 'Kathmandu, Nepal'
          });
        }
      } catch (err) {
        console.error('Error fetching contact info:', err);
      }
    };

    if (!isAdminPath) {
      fetchContactInfo();
    }
  }, [isAdminPath]);

  if (isAdminPath) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <img
                src="/logo.png"
                alt="Gyan Sagar Logo"
                className="footer-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <span className="footer-logo-icon" style={{ display: 'none' }}>📚</span>
              <h3>Gyan Sagar</h3>
            </div>
            <p className="footer-description">
              Your ultimate destination for LOKSEWA & GK preparation. Daily questions, study materials,
              and weekly quizzes to help you excel in competitive exams.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" title="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" title="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" title="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/materials">Study Materials</a>
              </li>
              <li>
                <a href="/blogs">Blogs</a>
              </li>
              <li>
                <a href="/quiz">Weekly Quiz</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li>
                <a href="#">History</a>
              </li>
              <li>
                <a href="#">Geography</a>
              </li>
              <li>
                <a href="#">Science</a>
              </li>
              <li>
                <a href="#">Constitution</a>
              </li>
              <li>
                <a href="#">World GK</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <Mail size={18} />
              <span>{contactInfo.email}</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>{contactInfo.address}</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Gyan Sagar. All rights reserved.</p>
          </div>
          <div className="footer-links-bottom">
            <a href="#">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="#">Terms & Conditions</a>
            <span className="divider">•</span>
            <a href="#">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
