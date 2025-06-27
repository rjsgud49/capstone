// FeatureSection.jsx
import React from 'react';
import './css/FeatureSection.css';
import FeatureCard from './FeatureCard';

function FeatureSection() {
    const features = [
        {           
            id: 1,
            icon: '🧩',
            title: '성gidgidgid 기반 매칭',
            description: 'MBTI, 생활패턴, 취침시간 등을 수집집해 나와 잘 맞는 룸메이트를 만날수 있습니다.'
        },
        {
            id: 2,
            icon: '🏠',
            title: '주거공간 추천',
            description: 'AI로 수집한 여러 데이터로 최적의 쉐어하우스를 찾고 안전한 계약까지 지원합니다.'
        },
        {
            id: 3,
            icon: '📋',
            title: '생활 규칙 관리',
            description: '청소, 식사, 공과금 분배 등의 규칙을 설정하여 주거자간의 갈등을 예방합니다.'
        }
    ];

    return (
        <section className="feature-section container">
            <h2 className="section-title">RoomIT의 주요 기능</h2>
            <div className="feature-grid">
                {features.map(feature => (
                    <FeatureCard
                        key={feature.id}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeatureSection;