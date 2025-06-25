// src/utils/auth.js
export const getAccessToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.warn('⚠️ accessToken 없음');
    } else {
        console.log('✅ accessToken 확인:', token);
    }
    return token;
};
