import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/css/User_Profile_Card.css';

const ProfileCard = ({ userData }) => {
    const {
        id,
        name = '이름 없음',
        age = 'N/A',
        gender = '성별 미정',
        job = '직업 미정',
        idealRoommate = '설명 없음',
        avatar,
    } = userData;

    const navigate = useNavigate();

    const handleDetailClick = () => {
        if (!id) {
            alert('프로필 ID가 없어 상세보기 불가');
            return;
        }
        navigate(`/meeting/${id}`);
    };

    const profileImageSrc = !avatar || avatar === '정보없음' ? '/userimg.jpg' : avatar;

    return (
        <div className="profile-card" style={{ cursor: 'pointer' }}>
            <div className="profile-image-container">
                <div className="profile-image">
                    <img
                        src={profileImageSrc}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/userimg.jpg';
                        }}
                        alt={`${name}의 프로필`}
                        className="profile-avatar"
                    />
                </div>
            </div>

            <div className="profile-info">
                <div className="Cardprofile-header">
                    <span className="profile-name">{name}</span>
                    <span className="profile-age">{age}세 ({gender})</span>
                </div>
                <div className="Cardprofile-job">{job}</div>
                <div className="profile-description">{idealRoommate}</div>

                <button className="profile-detail-button" onClick={handleDetailClick}>
                    프로필 상세보기
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
