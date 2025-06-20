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

                // ✅ profile이 null이 아니고 name이 "정보없음" 아닌 애들만
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

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류 발생: {error}</div>;

    const safeUsers = Array.isArray(users) && users.length > 0 ? users : [];

    return (
        <section className="roommate-section container">
            <h2 className="section-title">추천 룸메이트</h2>
            <div className="roommate-content">
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
                                avatar={avatarSrc}  // ✅ 기본 이미지 적용
                                mbti={profile.mbti}
                                job={profile.job}
                                location={profile.location}
                                budget={null}  // budget 필드 없음 (null로)
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
            </div>
        </section>
    );
}

export default RoommateSection;
