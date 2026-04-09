import React from 'react';
import { Layout, Settings, Image as ImageIcon, Save, RefreshCcw } from 'lucide-react';

const AdminHeroSettings = () => {
  return (
    <div className="admin-page fade-in">
      <div className="admin-header-section">
        <div className="admin-title-wrap">
          <div className="admin-title-icon">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="admin-main-title">Hero Section Settings</h1>
            <p className="admin-subtitle">Customize the landing page hero content, images, and visual theme.</p>
          </div>
        </div>
        <div className="admin-actions">
          <button className="admin-btn btn-secondary">
            <RefreshCcw size={16} /> Reset
          </button>
          <button className="admin-btn btn-primary">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="admin-content-card">
        <div className="admin-card-header">
          <Settings size={18} />
          <h3>General Configuration</h3>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Hero Title</label>
            <input type="text" className="admin-input" defaultValue="Prepare for Loksewa with Gyan Sagar" />
          </div>
          <div className="admin-form-group">
            <label>Hero Subtitle</label>
            <textarea className="admin-input" rows="3" defaultValue="The most comprehensive platform for Loksewa exam preparation in Nepal." />
          </div>
          <div className="admin-form-group">
            <label>Primary Button Text</label>
            <input type="text" className="admin-input" defaultValue="Get Started" />
          </div>
          <div className="admin-form-group">
            <label>Secondary Button Text</label>
            <input type="text" className="admin-input" defaultValue="View Materials" />
          </div>
        </div>
      </div>

      <div className="admin-content-card" style={{ marginTop: '2rem' }}>
        <div className="admin-card-header">
          <ImageIcon size={18} />
          <h3>Visual Assets</h3>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Hero Student Image (Portrait)</label>
            <div className="admin-file-upload">
              <input type="text" className="admin-input" defaultValue="/hero-students.png" readOnly />
              <button className="admin-btn btn-secondary">Change Image</button>
            </div>
            <p className="helper-text">Recommended size: 800x1200px (Transparent PNG)</p>
          </div>
        </div>
      </div>

      <div className="admin-info-banner" style={{ marginTop: '2rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.2rem', borderRadius: '12px', color: '#1e40af', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <RefreshCcw size={20} />
        <p style={{ margin: 0, fontSize: '0.92rem' }}><strong>Tip:</strong> Changes made here reflect instantly on the homepage. Use the "Save Changes" button to persist them permanently.</p>
      </div>
    </div>
  );
};

export default AdminHeroSettings;
