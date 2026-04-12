import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Download, Tag, Info, FileText } from 'lucide-react';
import materialService from '../services/materialService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import '../styles/components/StudyMaterials.css';

const StudyMaterials = ({ isFullPage = false, searchTerm = '' }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await materialService.getMaterials();
        setMaterials(Array.isArray(data) ? data : (data.materials || []));
      } catch (err) {
        setError('Failed to load study materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || 'https://gyansagar.onrender.com/api';

  const filteredMaterials = useMemo(() => {
    let result = materials;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(term) || 
        m.category?.toLowerCase().includes(term) ||
        m.description?.toLowerCase().includes(term)
      );
    }
    return isFullPage ? result : result.slice(0, 4);
  }, [materials, searchTerm, isFullPage]);

  if (loading) return <div className="materials-section"><div className="mat-container"><LoadingSpinner /></div></div>;
  
  if (error || (materials.length === 0 && !loading)) return (
    <div className={isFullPage ? "materials-section full-page" : "materials-section"}>
      <div className="mat-container">
        {!isFullPage && (
          <div className="section-row-header">
            <div className="section-row-title">
              <span className="section-row-icon">📊</span>
              <h2 className="section-row-h2">Latest Materials</h2>
            </div>
            <Link to="/materials" className="see-all-link">See All</Link>
          </div>
        )}
        <div className="no-materials-box">
           <Info size={40} className="empty-icon" />
           <p className="empty-text">{error || 'No materials available at the moment.'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className={isFullPage ? "materials-section full-page" : "materials-section"}>
      <div className="mat-container">
        {/* Header (Home Page only) */}
        {!isFullPage && (
          <div className="section-row-header">
            <div className="section-row-title">
              <span className="section-row-icon">📊</span>
              <h2 className="section-row-h2">Latest Materials</h2>
            </div>
            <Link to="/materials" className="see-all-link">See All</Link>
          </div>
        )}

        {/* Materials Grid */}
        <div className={isFullPage ? "premium-mat-grid-page" : "mat-grid"}>
          <AnimatePresence mode='popLayout'>
            {filteredMaterials.map((material, i) => (
              <motion.div
                key={material._id}
                layout
                className="mat-card-premium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
              >
                {/* PDF Badge & Category */}
                <div className="mat-card-top">
                  <div className="mat-pdf-badge-modern">
                    <FileText size={20} />
                    <span>PDF</span>
                  </div>
                  {material.category && (
                    <span className="mat-cat-badge">
                      <Tag size={12} />
                      {material.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mat-premium-content">
                  <h3 className="mat-premium-title">{material.title}</h3>
                  <p className="mat-premium-desc">
                    {material.description || 'Professional Loksewa guide and study materials for your preparation.'}
                  </p>
                  
                  <div className="mat-card-footer">
                    <div className="mat-meta">
                       <Download size={14} />
                       <span>{material.downloads || 0} Downloads</span>
                    </div>
                    
                    <a
                      href={`${API_URL}/materials/${material._id}/download`}
                      className="mat-premium-btn"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        // Optimistic UI for downloads can be handled here if needed
                      }}
                    >
                      Download <Download size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMaterials.length === 0 && searchTerm && (
          <div className="no-search-results">
            <Search size={48} />
            <p>No materials found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyMaterials;

