// HeroBanner.jsx
import React from 'react';
import './css/HeroBanner.css';
import { Link } from 'react-router-dom';


function HeroBanner() {
    return (
        <section className="hero-banner">
            <div className="hero-banner__background" />
            <div className="hero-content">
                <h1 className="hero-title">나에게 딱 맞는 룸메이트를 찾아보세요</h1>
                <p className="hero-subtitle">성향, 생활패턴, 관심사가 비슷한 최적의 룸메이트와 함께하세요</p>
                <div className="search-container">
                    <div className="test-promo">
                        <p>룸메이트 성향이 나와 잘 맞는 사람을 알아보세요</p>

                        <Link to="/meeting" className="test-button">
                            매칭 시작하기
                        </Link>

                    </div>

                </div>
            </div>
        </section >
    );
}

export default HeroBanner;