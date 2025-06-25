import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import './css/MyPages.css';

const MyProfileEdit = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(profile || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (e) => {
    const interestsArray = e.target.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setFormData({ ...formData, interests: interestsArray });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 여기에 submitProfile API 호출 가능 (예시로 onSave 호출)
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(formData);
    } catch (err) {
      console.error('프로필 저장 실패:', err);
      alert('프로필 저장 실패');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="meeting-user-detail">
      <div className="profile-header">
        <div className="mypageprofile-image-large">
          <div className="avatar-container">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={`${formData.name || 'User'} avatar`}
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
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="이름"
            className="input-field"
          />
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleChange}
            placeholder="나이"
            className="input-field"
          />
          <input
            type="text"
            name="job"
            value={formData.job || ''}
            onChange={handleChange}
            placeholder="직업"
            className="input-field"
          />
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="지역"
            className="input-field"
          />
        </div>
      </div>

      <section className="meetprofile-section">
        <h2>자기소개</h2>
        <textarea
          name="introduction"
          value={formData.introduction || ''}
          onChange={handleChange}
          className="textarea-field"
          rows={4}
          placeholder="자기소개를 입력하세요"
        />
      </section>

      <section className="meetprofile-section">
        <h2>관심사</h2>
        <input
          type="text"
          name="interests"
          value={Array.isArray(formData.interests) ? formData.interests.join(', ') : ''}
          onChange={handleInterestsChange}
          className="input-field"
          placeholder="관심사를 쉼표(,)로 구분해 입력하세요"
        />
      </section>

      <section className="meetprofile-section">
        <h2>이상적인 룸메이트</h2>
        <textarea
          name="idealRoommate"
          value={formData.idealRoommate || ''}
          onChange={handleChange}
          className="textarea-field"
          rows={3}
          placeholder="이상적인 룸메이트를 입력하세요"
        />
      </section>

      <section className="meetprofile-section lifestyle-details">
        <h2>기본 정보</h2>
        <div className="lifestyle-grid">
          <div className="lifestyle-item">
            <span>MBTI</span>
            <input
              type="text"
              name="mbti"
              value={formData.mbti || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="MBTI"
            />
          </div>
          <div className="lifestyle-item">
            <span>흡연</span>
            <input
              type="text"
              name="smoking"
              value={formData.smoking || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="흡연 여부"
            />
          </div>
          <div className="lifestyle-item">
            <span>음주</span>
            <input
              type="text"
              name="drinking"
              value={formData.drinking || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="음주 여부"
            />
          </div>
        </div>
      </section>

      <div className="action-buttons" style={{ marginTop: '20px' }}>
        <button
          className={`primary-button ${isSaving ? 'saving' : ''}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '프로필 저장'}
        </button>
        <button className="secondary-button" onClick={onCancel} style={{ marginLeft: '10px' }}>
          취소
        </button>
      </div>
    </div>
  );
};

export default MyProfileEdit;
// MyProfileEdit.jsx