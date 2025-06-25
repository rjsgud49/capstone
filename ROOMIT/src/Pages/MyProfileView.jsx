import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import './css/MyPages.css';
import { fetchProfile } from '../services/user';

const MyProfileView = ({ currentUser }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProfile(currentUser.id);
        setProfile(data);
      } catch (err) {
        console.error('프로필 로딩 실패:', err);
        setError('프로필을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      loadProfile();
    }
  }, [currentUser?.id]);

  if (isLoading) {
    return <div className="loading">프로필을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>
          다시 시도
        </button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="meeting-user-detail">
      <div className="profile-header">
        <div className="mypageprofile-image-large">
          <div className="avatar-container">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.name || 'User'} avatar`}
                className="room-avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <Camera size={40} />
                <span>프로필 사진 없음</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-basic-info">
          <h2>{profile.name}</h2>
          <p>{profile.gender} / {profile.age}세</p>
          <p>{profile.job} @ {profile.location}</p>
        </div>
      </div>

      <section className="meetprofile-section">
        <h2>자기소개</h2>
        <p>{profile.introduction || '내용 없음'}</p>
      </section>

      <section className="meetprofile-section">
        <h2>관심사</h2>
        <p>{profile.interests?.length > 0 ? profile.interests.join(', ') : '내용 없음'}</p>
      </section>

      <section className="meetprofile-section">
        <h2>이상적인 룸메이트</h2>
        <p>{profile.idealRoommate || '내용 없음'}</p>
      </section>

      <section className="meetprofile-section lifestyle-details">
        <h2>기본 정보</h2>
        <div className="lifestyle-grid">
          <div className="lifestyle-item">
            <span>MBTI</span>
            <p>{profile.mbti || '미입력'}</p>
          </div>
          <div className="lifestyle-item">
            <span>기상 시간</span>
            <p>{profile.wakeUpTime || '미입력'}</p>
          </div>
          <div className="lifestyle-item">
            <span>취침 시간</span>
            <p>{profile.sleepTime || '미입력'}</p>
          </div>
          <div className="lifestyle-item">
            <span>밤낮 성향</span>
            <p>{profile.dayNightType || '미입력'}</p>
          </div>
          <div className="lifestyle-item">
            <span>흡연</span>
            <p>{profile.smoking || '미입력'}</p>
          </div>
          <div className="lifestyle-item">
            <span>음주</span>
            <p>{profile.drinking || '미입력'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfileView;
