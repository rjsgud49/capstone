
// HousingSection.jsx
import React from 'react';
import './css/HousingSection.css';
import HousingCard from './HousingCard';

function  HousingSection() {
    const houses = [
        {
            id: 1,
            name: '강남 쉐어하우스 A',
            icon: '🏢',
            type: '2인실',
            price: '월 55만원',
            features: '지하철 5분거리 • 즉시 입주'
        },
        {
            id: 2,
            name: '마포 쉐어하우스 B',
            icon: '🏠',
            type: '3인실',
            price: '월 48만원',
            features: '대학가 인접 • 5월 입주'
        },
        {
            id: 3,
            name: '홍대 쉐어하우스 C',
            icon: '🏘️',
            type: '2인실',
            price: '월 60만원',
            features: '역세권 • 즉시 입주 가능'
        }
    ];

    return (
        <section className="housing-section container">
            <h2 className="section-title">추천 공유 주거 공간</h2>
            <div className='housing-section-content'>
                <div className="housing-grid">
                    {houses.map(house => (
                        <HousingCard
                            key={house.id}
                            name={house.name}
                            icon={house.icon}
                            type={house.type}
                            price={house.price}
                            features={house.features}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HousingSection;