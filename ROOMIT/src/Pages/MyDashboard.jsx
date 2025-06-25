// MyDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import MyProfileView from './MyProfileView';
import MyProfileEdit from './MyProfileEdit';
import Loading from './Loading';
import { fetchProfile } from '../services/user';

const MyDashboardPage = ({ currentUser, updateUserData }) => {
    const [profile, setProfile] = useState(null);
    const [pageMode, setPageMode] = useState('view');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);//

    useEffect(() => {
        if (!currentUser?.userId) return;

        const loadProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProfile(currentUser.userId);
                setProfile(data);
            } catch (err) {
                console.error('프로필 로딩 실패:', err);
                setError('프로필을 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [currentUser?.userId]);

    const handleSave = (updatedProfile) => {
        setProfile(updatedProfile);
        updateUserData(updatedProfile);
        setPageMode('view');
    };

    if (loading) return  <Loading />;
    if (error) return <Loading />;
    if (!profile) return null;

    return (
        <div className="dashboard-container">
            <h1>내 대시보드</h1>

            <div className="dashboard-nav">
                <button onClick={() => setPageMode('view')}>내 프로필 보기</button>
                <button onClick={() => setPageMode('edit')}>내 프로필 수정</button>
            </div>

            {pageMode === 'view' && <MyProfileView profile={profile} />}
            {pageMode === 'edit' && (
                <MyProfileEdit
                    profile={profile}
                    onSave={handleSave}
                    onCancel={() => setPageMode('view')}
                />
            )}
        </div>
    );
};

export default MyDashboardPage;
