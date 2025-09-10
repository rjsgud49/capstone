import axios from 'axios';
import { getAccessToken } from '../utils/auth';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
}); 

export const fetchAllProfiles = async () => {
    const response = await axios.get('/api/user/all/full');
    return response.data;
};


export const fetchProfile = async (userId) => {
    try {
        const response = await api.get(`/user/${userId}/full`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response
            ? `서버 에러: ${error.response.status} - ${error.response.data.message || '알 수 없는 에러'}`
            : error.message || '네트워크 에러가 발생했습니다.';
        //console.error('❌ 프로필 데이터를 가져오는 데 실패했습니다:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const submitProfile = async (profileData) => {
    try {
        if (!profileData.name || !profileData.age || !profileData.job) {
            throw new Error('필수 데이터가 누락되었습니다.');
        }

        const token = getAccessToken();
        if (!token) {
            throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
        }
        //console.log('Bearer token:', getAccessToken());

        //console.log('🔍 보낼 프로필 데이터:', profileData);

        const response = await api.post('/secure/profile', profileData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        //console.log('✅ 프로필 등록/수정 성공:', response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response
            ? `서버 에러: ${error.response.status} - ${error.response.data.message || '알 수 없는 에러'}`
            : error.message || '네트워크 에러가 발생했습니다.';
        //console.error('❌ 프로필 등록/수정 실패:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const submitInterests = async (userId, interests) => {
    try {
        const token = getAccessToken();

        // console.log('📦 가져온 토큰:', token);
        if (!token) {
            throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
        }

        const payload = {
            userId,
            interests,
        };

        // console.log('🔍 보낼 관심사 데이터:', payload);

        const response = await api.post('/secure/interests', payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log('✅ 관심사 저장 성공:', response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response
            ? `서버 에러: ${error.response.status} - ${error.response.data.message || '알 수 없는 에러'}`
            : error.message || '네트워크 에러가 발생했습니다.';
        console.error('❌ 관심사 저장 실패:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateMatching = async (userId, matching) => {
    try {
        const response = await api.patch(`/profile/${userId}/matching`, { matching });
        //console.log('✅ 매칭 상태 업데이트 성공:', response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response
            ? `서버 에러: ${error.response.status} - ${error.response.data.message || '알 수 없는 에러'}`
            : error.message || '네트워크 에러가 발생했습니다.';
        //console.error('❌ 매칭 상태 업데이트 실패:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        //console.log('✅ 아바타 업로드 성공:', response.data);
        return response.data.url;
    } catch (error) {
        const errorMessage = error.response
            ? `서버 에러: ${error.response.status} - ${error.response.data.message || '알 수 없는 에러'}`
            : error.message || '네트워크 에러가 발생했습니다.';
        //console.error('❌ 아바타 업로드 실패:', errorMessage);
        throw new Error(errorMessage);
    }
};
