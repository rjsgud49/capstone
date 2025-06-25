import React, { useEffect, useState } from 'react';
import './css/RoommateSection.css';
import RoommateCard from './RoommateCard';
import { fetchAllProfiles } from '../services/user';

function RoommateSection() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllProfiles();
                console.log('✅ 프로필 목록:', data);

                const filteredUsers = data.filter(user =>
                    user.profile &&
                    user.profile.name !== '정보없음'
                );

                setUsers(filteredUsers);
            } catch (err) {
                console.error('❌ 프로필 가져오기 실패:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const safeUsers = Array.isArray(users) && users.length > 0 ? users : [];

    return (
        <section className="roommate-section container">
            <h2 className="section-title">추천 룸메이트</h2>
            <div className="roommate-content">
                {loading ? (
                    <div className="loading-message">로딩 중...</div>
                ) : error ? (
                    <div className="error-message">
                        ⚠️ 유저 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                    </div>
                ) : safeUsers.length === 0 ? (
                    <div className="empty-message">현재 등록된 유저 데이터가 없습니다.</div>
                ) : (
                    <div className="roommate-grid">
                        {safeUsers.slice(0, 5).map((user, index) => {
                            const profile = user.profile;

                            const avatarSrc = profile.avatar && profile.avatar !== '정보없음' && profile.avatar !== ''
                                ? profile.avatar
                                : '/userimg.jpg';

                            return (
                                <RoommateCard
                                    key={user.userId || index}
                                    id={user.userId || index}
                                    name={profile.name}
                                    age={profile.age}
                                    sex={profile.gender}
                                    avatar={avatarSrc}
                                    mbti={profile.mbti}
                                    job={profile.job}
                                    location={profile.location}
                                    budget={null}
                                    sleep={`${profile.wakeUpTime} ~ ${profile.sleepTime}`}
                                    lifestyle={{
                                        cleanLevel: profile.cleanLevel,
                                        noise: profile.noise,
                                        smoking: profile.smoking,
                                        drinking: profile.drinking,
                                        dayNightType: profile.dayNightType
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default RoommateSection;
