import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock } from 'lucide-react';
import StudyMaterials from '../components/StudyMaterials.jsx';
import '../styles/pages/BlogsPage.css'; // Reusing header styles for consistency

const MaterialsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="blogs-page-container">
      <header className="blogs-header">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="container"
        >
          <h1 className="blogs-header-title">Study Materials</h1>
          <p className="blogs-header-subtitle">
            Access our curated library of Loksewa preparation guides, PDF notes, 
            and solved past questions.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="materials-search-wrapper">
             <div className="mat-search-glass">
                <Search size={20} className="mat-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search materials by name or category..." 
                  className="mat-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="mat-search-meta">
                <span><BookOpen size={14} /> Comprehensive PDFs</span>
                <span><Clock size={14} /> Updated Weekly</span>
             </div>
          </div>
        </motion.div>
      </header>
 
      <StudyMaterials isFullPage={true} searchTerm={searchTerm} />
    </div>
  );
};

export default MaterialsPage;
