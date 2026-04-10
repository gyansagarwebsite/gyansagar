import React from 'react';

const ProtectionOverlay = () => (
    <div className="protection-overlay">
        <div className="protection-warning-icon">🛡️</div>
        <div className="protection-warning-text">Security Protection Active</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>Content is obscured for security purposes</div>
    </div>
);

export default ProtectionOverlay;
