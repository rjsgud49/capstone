import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllProfiles } from '../services/user';
import ProfileCard from '../Components/User_Profile_Card';
import FilterPanel from '../Components/Filter';
import { Funnel } from 'lucide-react';
import '../Pages/css/Meeting.css';
import Loading from './Loading';
import RetryPage from './RetryPage';

// ✅ 평탄화된 데이터에 맞춘 필터 경로 사용
const filters = [
    {
        category: '나이대',
        path: 'age',
        options: ['상관없음', '20-25', '26-30', '31-35'],
        filterFn: (age, selectedRange) => {
            if (typeof age !== 'number') return false;
            const [min, max] = selectedRange.split('-').map(Number);
            return age >= min && age <= max;
        }
    },
    {
        category: '흡연',
        path: 'smoking',
        options: ['상관없음', '비흡연', '흡연']
    },
    {
        category: '활동시간',
        path: 'dayNightType',
        options: ['상관없음', '아침형', '저녁형', '밤']
    },
    {
        category: '음주',
        path: 'drinking',
        options: ['상관없음', '음주', '가끔', '비음주', '안 함']
    },
    {
        category: '청결 수준',
        path: 'cleanLevel',
        options: ['상관없음', '낮음', '보통', '높음', '매우 높음']
    },
    {
        category: '소음 민감도',
        path: 'noise',
        options: ['상관없음', '낮음', '보통', '높음', '매우 민감']
    }
];

// ✅ 서버 응답 유저 배열을 평탄화
const flattenUserProfiles = (users) => {
    return users
        .filter(user => user && user.profile)
        .map(user => ({
            id: user.userId,                  // 상세 페이지용
            userId: user.userId,              // 서버 전송용
            ...user.profile,
            interests: user.interests || [],
        }));
};

const Meeting = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadProfiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchAllProfiles();
            console.log('✅ 전체 유저 데이터:', data);
            const flatData = flattenUserProfiles(data);
            setUsers(flatData);
            setFilteredUsers(flatData);
        } catch (err) {
            console.error('❌ 프로필 불러오기 실패:', err);
            setError('데이터를 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfiles();
    }, [loadProfiles]);

    const togglePanel = () => {
        setOpen(prev => !prev);
        console.log('📂 필터 패널 상태:', !open);
    };

    if (isLoading) return <Loading />;
    if (error) return <RetryPage errorMessage={error} onRetry={loadProfiles} />;

    return (
        <div className="roommates-list">
            <div className="meeting-header">
                <h1>룸메이트 매칭</h1>
                <h2>룸메이트를 찾아보세요!</h2>
                <button className="filterbtn" onClick={togglePanel}>
                    <Funnel size={17} />
                    필터
                </button>
            </div>

            <FilterPanel
                open={open}
                setOpen={setOpen}
                filters={filters}
                items={users}
                onFilterChange={setFilteredUsers}
                showFilterButton={false}
            />

            <div className="roommate-list">
                {filteredUsers.map(user => (
                    <ProfileCard
                        key={user.userId}
                        userData={user}   // ✅ id, userId 포함된 평탄 구조
                    />
                ))}
            </div>
        </div>
    );
};

export default Meeting;
