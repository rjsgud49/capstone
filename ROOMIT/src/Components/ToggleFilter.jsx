import React, { useState } from "react";
import "./css/ToggleFilter.css";

const ToggleFilter = ({ label, onToggle }) => {
    const [isOn, setIsOn] = useState(false);

    const handleClick = () => {
        const newState = !isOn;
        setIsOn(newState);
        onToggle?.(newState);
    };

    return (
        <div className="toggle-filter-container" onClick={handleClick}>
            <span className="toggle-label">{label}</span>
            <div className={`toggle-switch ${isOn ? "on" : ""}`}>
                <div className="toggle-circle" />
            </div>
        </div>
    );
};

export default React.memo(ToggleFilter);