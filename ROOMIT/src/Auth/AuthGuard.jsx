import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('accessToken'); // accessToken으로 변경

    useEffect(() => {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login'); // 뒤로 가기보다 로그인 페이지로 이동
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null; // 아무것도 안 보여줌
    }

    return children; // 보호된 페이지 렌더링
};

export default AuthGuard;
