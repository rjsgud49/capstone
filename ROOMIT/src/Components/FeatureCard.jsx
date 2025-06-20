// FeatureCard.jsx
import React from 'react';
import './css/FeatureCard.css';

function FeatureCard({ icon, title, description }) {
    return (
        <div className="feature-card card">
            <div className="feature-icon-wrapper">
                <span className="feature-icon" role="img" aria-label={title}>
                    {icon}
                </span>
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
}

export default FeatureCard;