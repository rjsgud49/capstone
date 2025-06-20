import React from 'react';
import './css/Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="spinner" />
            <p className="loading-text">데이터를 불러오는 중입니다...</p>
        </div>
    );
};

export default Loading;
