// /services/user.js
import axios from 'axios';
import { getAccessToken } from '../utils/auth';

/** -------------------------------
 *  토큰 정규화: "Bearer xxx" / "xxx" 모두 허용
 * -------------------------------- */
function normalizeBearer(token) {
    if (!token || typeof token !== 'string') return '';
    const trimmed = token.trim();
    return trimmed.toLowerCase().startsWith('bearer ')
        ? trimmed
        : `Bearer ${trimmed}`;
}

/** -------------------------------
 *  Axios 인스턴스
 * -------------------------------- */
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true, // 쿠키 기반 인증이면 주석 해제
});

/** -------------------------------
 *  요청 인터셉터: Authorization 자동 주입
 * -------------------------------- */
api.interceptors.request.use((config) => {
    const raw = getAccessToken(); // localStorage 등에서 읽어오는 함수
    if (raw) {
        config.headers = config.headers || {};
        config.headers.Authorization = normalizeBearer(raw);
    }
    return config;
});

/** -------------------------------
 *  응답 인터셉터: 401 공통 처리(선택)
 *  - 리프레시 토큰 플로우가 있으면 여기서 갱신 로직 추가
 * -------------------------------- */
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            // TODO: 리프레시 토큰 있으면 재발급 시도 로직 추가
            console.warn('🔒 401 Unauthorized - 토큰 만료/무효. 재로그인이 필요합니다.');
            // 예시: 토큰 제거
            // localStorage.removeItem('accessToken');
            // localStorage.removeItem('refreshToken');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/** -------------------------------
 *  공통 에러 메시지 변환
 * -------------------------------- */
function toMessage(error, fallback = '네트워크 에러가 발생했습니다.') {
    return error?.response
        ? `서버 에러: ${error.response.status} - ${error.response.data?.message || '알 수 없는 에러'
        }`
        : error?.message || fallback;
}

/** ===============================
 *  API 함수들
 * =============================== */

/** 전체 프로필 조회 (공개/관리자 전용이면 토큰 자동첨부) */
export const fetchAllProfiles = async () => {
    try {
        const { data } = await api.get('/user/all/full');
        return data;
    } catch (error) {
        throw new Error(toMessage(error));
    }
};

/** 개별 프로필 조회 */
export const fetchProfile = async (userId) => {
    try {
        const { data } = await api.get(`/user/${userId}/full`);
        return data;
    } catch (error) {
        throw new Error(toMessage(error));
    }
};

/** 프로필 등록/수정 (보안 경로) */
export const submitProfile = async (profileData) => {
    try {
        if (!profileData.name || !profileData.age || !profileData.job) {
            throw new Error('필수 데이터가 누락되었습니다.');
        }

        // 인터셉터가 Authorization을 자동 부착하므로 별도 headers 불필요
        const { data } = await api.post('/secure/profile', profileData);
        return data;
    } catch (error) {
        throw new Error(toMessage(error));
    }
};

/** 관심사 저장 (보안 경로) */
export const submitInterests = async (userId, interests) => {
    try {
        const payload = { userId, interests };
        const { data } = await api.post('/secure/interests', payload);
        return data;
    } catch (error) {
        console.error('❌ 관심사 저장 실패:', toMessage(error));
        throw new Error(toMessage(error));
    }
};

/** 매칭 공개/비공개 토글 (보안 경로라면 자동으로 토큰 부착) */
export const updateMatching = async (userId, matching) => {
    try {
        const { data } = await api.patch(`/profile/${userId}/matching`, { matching });
        return data;
    } catch (error) {
        throw new Error(toMessage(error));
    }
};

/** 아바타 업로드 (대부분 보안 경로) */
export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const { data } = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.url;
    } catch (error) {
        throw new Error(toMessage(error));
    }
};
