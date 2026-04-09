import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroService from '../services/heroService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import '../styles/components/HeroSection.css';

const HeroSection = () => {
  const [settings, setSettings] = useState({
    heroTitle: 'लोकसेवा तयारी\n<span class="hero-highlight">स्मार्ट तरिकाले!</span>',
    heroSubtitle: 'प्रतिदिन नयाँ प्रश्न र अध्यन सामग्री',
    heroButtonText: 'Start Learning'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    heroService.getHeroSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="hero-section">
        <div className="hero-container">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } 
    },
  };

  const illustrationVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1, 
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 } 
    },
  };

  return (
    <section className="hero-section">
      <div className="hero-gradient-bg"></div>
      <div className="hero-container">
        {/* Left: Text Content */}
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="hero-title"
            variants={itemVariants}
            dangerouslySetInnerHTML={{ __html: settings.heroTitle }}
          />
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {settings.heroSubtitle}
          </motion.p>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/quiz" className="hero-btn">
              {settings.heroButtonText || 'Start Learning'}
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div 
          className="hero-illustration"
          variants={illustrationVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-illustration-inner">
            <img src="/hero-students.jpg" alt="Students studying" className="hero-student-img" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
