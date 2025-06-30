import React, { useEffect, useState } from 'react';
import './css/HousingSection.css';
import HousingCard from './HousingCard';
import gcpAPI from '../services/gcp'; // ✅ GCP 백엔드용 axios 인스턴스

function HousingSection() {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHousingData = async () => {
            try {
                const response = await gcpAPI.get('/listings/search', {
                    params: { query: '강남' },
                });

                const data = response.data;
                const mapped = data.map((item, index) => ({
                    id: index,
                    name: item.name || '쉐어하우스',
                    icon: '🏠',
                    type: item.roomType || '2인실',
                    price: `월 ${item.monthly || 50}만원`,
                    features: item.features || '즉시 입주 가능',
                }));
                setHouses(mapped);
            } catch (err) {
                setError('매물 정보를 불러오지 못했습니다.');
                console.error('❌ 매물 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHousingData();
    }, []);

    if (loading) return <div className="housing-section">로딩 중...</div>;
    if (error) return <div className="housing-section">{error}</div>;

    return (
        <section className="housing-section container">
            <h2 className="section-title">추천 공유 주거 공간</h2>
            <div className="housing-section-content">
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
