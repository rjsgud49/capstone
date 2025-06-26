// 📁 api/auth.js
import api from './instance';

// 공통 에러 처리 함수
const handleApiError = (error, contextMessage) => {
    const errorMessage = error.response
        ? `서버 오류: ${error.response.data.error || error.response.statusText}`
        : error.request
            ? '서버와 연결할 수 없습니다.'
            : `요청 설정 오류: ${error.message}`;

    console.error(`❌ ${contextMessage}:`, errorMessage);
    alert(errorMessage);
    throw error;
};

// 회원가입
export const registerUser = async ({ userId, email, password }) => {
    try {
        const response = await api.post('/user', { userId, email, password });
        return response.data;
    } catch (error) {
        handleApiError(error, '회원가입 실패');
    }
};

// 로그인
export const loginUser = async ({ userId, password }) => {
    try {
        const response = await api.post('/api/login', { userId, password });
        return response.data; // { token, user }
    } catch (error) {
        handleApiError(error, '로그인 실패');
    }
};
