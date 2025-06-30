// HousingCard.jsx
import React from 'react';
import './css/HousingCard.css';

function HousingCard({ name, icon, type, price, features }) {
    return (
        <div className="housing-card card">
            <div className="housing-icon-wrapper">
                <span className="housing-icon" role="img" aria-label="Housing">
                    {icon}
                </span> 
            </div>
            <div className="housing-details">
                <h3 className="housing-name">{name}</h3>
                <p className="housing-info">{type} • {price}</p>
                <p className="housing-features">{features}</p>
            </div>
        </div>
    );
}

export default HousingCard;