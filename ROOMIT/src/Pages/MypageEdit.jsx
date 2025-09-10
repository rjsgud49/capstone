import React, { useState, useRef, useEffect } from 'react';
import {
    MapPin, Briefcase, Calendar, Star, Coffee, Home, Volume2,
    Utensils, Moon, Sun, Cat, Camera, Upload,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './css/MyPages.css';
import { fetchProfile, submitProfile, uploadAvatar } from '../services/user';

/* ===================== 폼 기본값 ===================== */
const EMPTY_FORM = {
    userId: '',
    name: '',
    age: '',
    job: '',
    avatar: '',
    avatarFile: null,
    gender: '',
    location: '',
    introduction: '',
    interests: [],
    idealRoommate: '',
    mbti: '',
    smoking: '',
    drinking: '',
    matching: false,
    lifestyle: { wakeUpTime: '', sleepTime: '', dayNightPreference: '' },
    habits: {
        food: { mealTime: '', kitchenUse: '', cookingFrequency: '' },
        cleaning: { cleanLevel: '', cleaningFrequency: '', sharedSpaceManagement: '' },
        noiseSensitivity: { sensitivityLevel: '', sleepNoisePreference: '', musicTVVolume: '' },
        petPreferences: { allowed: '', petType: '', allergy: '' },
    },
};

/* 서버 응답 -> 폼 구조 매핑(빈 문자열/널도 그대로 반영) */
function mapServerToForm(userId, data) {
    return {
        userId: userId || '',
        name: data?.name ?? '',
        age: data?.age ?? '',
        job: data?.job ?? '',
        avatar: data?.avatar ?? '',
        gender: data?.gender ?? '',
        location: data?.location ?? '',
        introduction: data?.introduction ?? '',
        interests: Array.isArray(data?.interests) ? data.interests : [],
        idealRoommate: data?.idealRoommate ?? '',
        mbti: data?.mbti ?? '',
        smoking: data?.smoking ?? '',
        drinking: data?.drinking ?? '',
        matching: data?.matching ?? false,
        lifestyle: {
            wakeUpTime: data?.wakeUpTime ?? '',
            sleepTime: data?.sleepTime ?? '',
            dayNightPreference: data?.dayNightType ?? '',
        },
        habits: data?.habits ?? EMPTY_FORM.habits,
    };
}

/* 중첩 경로 접근 유틸 */
const getNestedValue = (obj, path) =>
    (path.split('.').reduce((cur, key) => (cur && cur[key] !== undefined ? cur[key] : ''), obj) ?? '') || '';

const MyEditPage = ({ currentUser, updateUserData }) => {
    const navigate = useNavigate();

    /* ✅ userId 안전하게 가져오기 */
    const getUserId = () => {
        if (currentUser?.userId) return currentUser.userId;
        if (currentUser?.id) return currentUser.id;
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            try {
                const u = JSON.parse(stored);
                return u.userId || u.id || u?.profile?.userId || u?.profile?.id;
            } catch { /* noop */ }
        }
        return null;
    };

    /* ✅ 폼: 완전 빈 값으로 시작하고, 서버 값으로 1회 수화 */
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [hydrated, setHydrated] = useState(false); // 서버값 1회 반영했는지
    const [interestsInput, setInterestsInput] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    /* ✅ 마운트 시 서버에서 프로필 로딩 → 최초 1회만 덮어쓰기 */
    useEffect(() => {
        let mounted = true;

        const uid = getUserId();
        if (!uid) {
            setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
            return;
        }

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchProfile(uid);
                if (!mounted) return;

                if (!hydrated) {
                    const next = mapServerToForm(uid, data);
                    setFormData(next);
                    setInterestsInput(next.interests.join(', '));
                    setHydrated(true);
                }
            } catch (e) {
                console.error('프로필 로딩 실패:', e);
                setError('프로필을 불러올 수 없습니다. 서버 또는 네트워크 문제입니다.');
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* blob URL 정리 */
    useEffect(() => {
        return () => {
            if (formData.avatar && typeof formData.avatar === 'string' && formData.avatar.startsWith('blob:')) {
                URL.revokeObjectURL(formData.avatar);
            }
        };
    }, [formData.avatar]);

    /* ============ 핸들러들 ============ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLifestyleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            lifestyle: { ...prev.lifestyle, [name]: value },
        }));
    };

    const handleHabitChange = (category, field, value) => {
        setFormData((prev) => ({
            ...prev,
            habits: {
                ...prev.habits,
                [category]: { ...prev.habits[category], [field]: value },
            },
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (formData.avatar && String(formData.avatar).startsWith('blob:')) {
            URL.revokeObjectURL(formData.avatar);
        }
        setFormData((prev) => ({
            ...prev,
            avatarFile: file,
            avatar: URL.createObjectURL(file),
        }));
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    /* 컴포넌트 로컬 버전의 관심사 저장(fetch 사용) */
    const submitInterests = async (userId, interests) => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('로그인이 필요합니다.');

        const res = await fetch('/api/secure/interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, interests }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`관심사 저장 실패: ${res.status} ${errorText}`);
        }
        return res.text();
    };

    const handleSave = async () => {
        const uid = formData.userId || getUserId();
        if (!uid) { alert('userId가 비어 있습니다! 로그인 상태를 확인하세요.'); return; }

        if (!formData.name || !formData.age || !formData.job) {
            alert('이름, 나이, 직업은 필수 입력 항목입니다.');
            return;
        }

        const age = parseInt(formData.age, 10);
        if (isNaN(age) || age < 18 || age > 100) {
            alert('나이는 18세 이상 100세 이하로 입력해 주세요.');
            return;
        }

        if (!formData.interests || formData.interests.length === 0) {
            alert('관심사를 최소 하나 이상 입력해 주세요.');
            return;
        }

        setIsSaving(true);
        try {
            let avatarUrl = formData.avatar;
            if (formData.avatarFile) {
                avatarUrl = await uploadAvatar(formData.avatarFile);
            }

            const payload = {
                userId: uid,
                name: formData.name ?? '',
                age: age || 0,
                gender: formData.gender ?? '',
                location: formData.location ?? '',
                job: formData.job ?? '',
                introduction: formData.introduction ?? '',
                idealRoommate: formData.idealRoommate ?? '',
                mbti: formData.mbti ?? '',
                dayNightType: formData.lifestyle?.dayNightPreference ?? '',
                cleanLevel: formData.habits?.cleaning?.cleanLevel ?? '',
                noise: formData.habits?.noiseSensitivity?.sensitivityLevel ?? '',
                smoking: formData.smoking ?? '',
                drinking: formData.drinking ?? '',
                avatar: avatarUrl ?? '',
                wakeUpTime: formData.lifestyle?.wakeUpTime ?? '',
                sleepTime: formData.lifestyle?.sleepTime ?? '',
            };

            await submitProfile(payload);
            await submitInterests(uid, formData.interests);

            updateUserData({ ...payload, interests: formData.interests });
            navigate('/mypages');
        } catch (error) {
            console.error('저장 실패:', error);
            alert(`프로필 저장에 실패했습니다: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    /* interestsInput ↔ formData.interests 동기화 */
    useEffect(() => {
        setInterestsInput(Array.isArray(formData.interests) ? formData.interests.join(', ') : '');
    }, [formData.interests]);

    /* ============ 렌더링 ============ */
    if (isLoading) return <div className="loading">프로필을 불러오는 중...</div>;

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

    const lifestyleCategories = [
        {
            title: '🍽️ 식생활 & 주방 관련',
            category: 'food',
            items: [
                { label: '식사 시간', field: 'mealTime', type: 'select', options: ['불규칙적', '아침형', '저녁형', '밤형'] },
                { label: '주방 사용', field: 'kitchenUse', type: 'select', options: ['거의 안함', '가끔', '자주', '매일'] },
                { label: '요리 빈도', field: 'cookingFrequency', type: 'select', options: ['거의 안함', '가끔', '자주', '매일'] },
            ],
            icon: <Utensils size={40} />,
        },
        {
            title: '🧹 청결 및 정리 습관',
            category: 'cleaning',
            items: [
                { label: '청결 수준', field: 'cleanLevel', type: 'select', options: ['낮음', '보통', '높음', '매우 높음'] },
                { label: '청소 주기', field: 'cleaningFrequency', type: 'select', options: ['필요할 때만', '주 1회', '주 2-3회', '매일'] },
                { label: '공용공간 관리', field: 'sharedSpaceManagement', type: 'select', options: ['개인공간만 관리', '가끔 정리', '공용공간 정리 참여', '적극적으로 관리'] },
            ],
            icon: <Home size={40} />,
        },
        {
            title: '🔊 소음 민감도',
            category: 'noiseSensitivity',
            items: [
                { label: '소음 민감도', field: 'sensitivityLevel', type: 'select', options: ['둔감', '보통', '민감', '매우 민감'] },
                { label: '취침시 소음', field: 'sleepNoisePreference', type: 'select', options: ['조용해야 함', '백색소음 선호', '약간의 소음 허용', '소음에 둔감'] },
                { label: '음악/TV 볼륨', field: 'musicTVVolume', type: 'select', options: ['낮은 볼륨', '중간 볼륨', '높은 볼륨', '헤드폰 사용'] },
            ],
            icon: <Volume2 size={40} />,
        },
        {
            title: '🐶 애완동물',
            category: 'petPreferences',
            items: [
                { label: '반려동물 허용 여부', field: 'allowed', type: 'select', options: ['허용 안함', '일부 허용', '대부분 허용', '모두 허용'] },
                { label: '선호 반려동물', field: 'petType', type: 'text' },
                { label: '반려동물 알레르기', field: 'allergy', type: 'select', options: ['없음', '경미함', '중간', '심함'] },
            ],
            icon: <Cat size={40} />,
        },
    ];

    return (
        <>
            <div className="meeting-user-detail">
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <Link to="/Mypages" className="btn-edit-profile">프로필 보기</Link>
                </div>

                <div className="profile-header">
                    <div className="mypageprofile-image-large">
                        <div className="avatar-container">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt={`${formData.name || 'User'} avatar`}
                                    className="room-avatar-image"
                                    onClick={handleAvatarClick}
                                />
                            ) : (
                                <div className="avatar-placeholder" onClick={handleAvatarClick}>
                                    <Camera size={40} />
                                    <span>프로필 사진</span>
                                </div>
                            )}
                            <div className="avatar-upload-button" onClick={handleAvatarClick}>
                                <Upload size={20} />
                                <span>사진 변경</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
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
                        <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">성별 선택</option>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                            <option value="기타">기타</option>
                        </select>

                        <input
                            type="number"
                            name="age"
                            value={formData.age || ''}
                            onChange={handleChange}
                            placeholder="나이"
                            className="input-field"
                        />

                        <div className="profile-job-location">
                            <div className="profile-job">
                                <Briefcase size={40} />
                                <input
                                    type="text"
                                    name="job"
                                    value={formData.job || ''}
                                    onChange={handleChange}
                                    placeholder="직업"
                                    className="input-field"
                                />
                            </div>
                            <div className="profile-location">
                                <MapPin size={40} />
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
                    <textarea
                        name="interests"
                        value={interestsInput}
                        onChange={(e) => setInterestsInput(e.target.value)}
                        onBlur={() => {
                            const interestsArray = interestsInput
                                .split(',')
                                .map((s) => s.trim())
                                .filter((s) => s.length > 0);
                            setFormData((prev) => {
                                const updated = { ...prev, interests: interestsArray };

                                // 로컬스토리지 동기화(옵션)
                                const s = localStorage.getItem('currentUser');
                                if (s) {
                                    try {
                                        const parsed = JSON.parse(s);
                                        const updatedUser = {
                                            ...parsed,
                                            profile: { ...(parsed.profile || {}), interests: interestsArray },
                                        };
                                        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                                    } catch { }
                                }
                                return updated;
                            });
                        }}
                        className="textarea-field"
                        rows={2}
                        placeholder="게임, 운동, 산책 등 쉼표(,)로 구분해 주세요"
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
                            <Star size={40} />
                            <span>MBTI</span>
                            <select
                                name="mbti"
                                value={formData.mbti || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">선택해주세요</option>
                                {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lifestyle-item">
                            <Sun size={40} />
                            <span>기상 시간</span>
                            <input
                                type="time"
                                name="wakeUpTime"
                                value={formData.lifestyle?.wakeUpTime || ''}
                                onChange={handleLifestyleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="lifestyle-item">
                            <Moon size={40} />
                            <span>취침 시간</span>
                            <input
                                type="time"
                                name="sleepTime"
                                value={formData.lifestyle?.sleepTime || ''}
                                onChange={handleLifestyleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="lifestyle-item">
                            <Calendar size={40} />
                            <span>밤낮 성향</span>
                            <select
                                name="dayNightPreference"
                                value={formData.lifestyle?.dayNightPreference || ''}
                                onChange={handleLifestyleChange}
                                className="input-field"
                            >
                                <option value="">선택해주세요</option>
                                <option value="낮">낮</option>
                                <option value="밤">밤</option>
                            </select>
                        </div>

                        <div className="lifestyle-item">
                            <Coffee size={40} />
                            <span>흡연 여부</span>
                            <select
                                name="smoking"
                                value={formData.smoking || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">선택해주세요</option>
                                <option value="안 함">안 함</option>
                                <option value="가끔">가끔</option>
                                <option value="자주">자주</option>
                            </select>
                        </div>

                        <div className="lifestyle-item">
                            <Coffee size={40} />
                            <span>음주</span>
                            <select
                                name="drinking"
                                value={formData.drinking || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">선택해주세요</option>
                                <option value="안 함">안 함</option>
                                <option value="가끔">가끔</option>
                                <option value="자주">자주</option>
                            </select>
                        </div>
                    </div>
                </section>

                {[
                    {
                        title: '🍽️ 식생활 & 주방 관련',
                        category: 'food',
                        items: [
                            { label: '식사 시간', field: 'mealTime', type: 'select', options: ['불규칙적', '아침형', '저녁형', '밤형'] },
                            { label: '주방 사용', field: 'kitchenUse', type: 'select', options: ['거의 안함', '가끔', '자주', '매일'] },
                            { label: '요리 빈도', field: 'cookingFrequency', type: 'select', options: ['거의 안함', '가끔', '자주', '매일'] },
                        ],
                        icon: <Utensils size={40} />,
                    },
                    {
                        title: '🧹 청결 및 정리 습관',
                        category: 'cleaning',
                        items: [
                            { label: '청결 수준', field: 'cleanLevel', type: 'select', options: ['낮음', '보통', '높음', '매우 높음'] },
                            { label: '청소 주기', field: 'cleaningFrequency', type: 'select', options: ['필요할 때만', '주 1회', '주 2-3회', '매일'] },
                            { label: '공용공간 관리', field: 'sharedSpaceManagement', type: 'select', options: ['개인공간만 관리', '가끔 정리', '공용공간 정리 참여', '적극적으로 관리'] },
                        ],
                        icon: <Home size={40} />,
                    },
                    {
                        title: '🔊 소음 민감도',
                        category: 'noiseSensitivity',
                        items: [
                            { label: '소음 민감도', field: 'sensitivityLevel', type: 'select', options: ['둔감', '보통', '민감', '매우 민감'] },
                            { label: '취침시 소음', field: 'sleepNoisePreference', type: 'select', options: ['조용해야 함', '백색소음 선호', '약간의 소음 허용', '소음에 둔감'] },
                            { label: '음악/TV 볼륨', field: 'musicTVVolume', type: 'select', options: ['낮은 볼륨', '중간 볼륨', '높은 볼륨', '헤드폰 사용'] },
                        ],
                        icon: <Volume2 size={40} />,
                    },
                    {
                        title: '🐶 애완동물',
                        category: 'petPreferences',
                        items: [
                            { label: '반려동물 허용 여부', field: 'allowed', type: 'select', options: ['허용 안함', '일부 허용', '대부분 허용', '모두 허용'] },
                            { label: '선호 반려동물', field: 'petType', type: 'text' },
                            { label: '반려동물 알레르기', field: 'allergy', type: 'select', options: ['없음', '경미함', '중간', '심함'] },
                        ],
                        icon: <Cat size={40} />,
                    },
                ].map((category, idx) => (
                    <section key={idx} className="meetprofile-section lifestyle-details">
                        <h2>{category.title}</h2>
                        <div className="lifestyle-grid">
                            {category.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="lifestyle-item">
                                    {category.icon}
                                    <span>{item.label}</span>
                                    {item.type === 'select' ? (
                                        <select
                                            value={getNestedValue(formData, `habits.${category.category}.${item.field}`)}
                                            onChange={(e) => handleHabitChange(category.category, item.field, e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">선택해주세요</option>
                                            {item.options.map((option, optIdx) => (
                                                <option key={optIdx} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={getNestedValue(formData, `habits.${category.category}.${item.field}`)}
                                            onChange={(e) => handleHabitChange(category.category, item.field, e.target.value)}
                                            className="input-field"
                                            placeholder={`${item.label}을 입력하세요`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                <div className="action-buttons">
                    <button
                        className={`primary-button ${isSaving ? 'saving' : ''}`}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? '저장 중...' : '프로필 저장'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default MyEditPage;
