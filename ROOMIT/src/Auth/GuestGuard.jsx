import { Navigate } from 'react-router-dom';

const GuestGuard = ({ children }) => {
    const token = localStorage.getItem('accessToken'); // 실제 저장된 키로 변경
    const isLoggedIn = !!token;

    // console.log('🧭 GuestGuard - accessToken:', token);
    // console.log('GuestGuard - isLoggedIn:', isLoggedIn);

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestGuard;
