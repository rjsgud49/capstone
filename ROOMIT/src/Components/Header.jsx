import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css';
import profileImage from '/userimg.jpg';

function Header() {
    const isLoggedIn = !!localStorage.getItem('accessToken');


    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    return (
        <header className="header">
            <div className="logo">
                <img src="/ROMMITlogo.svg" alt="로고" className="logo-image" width="40px" />
                ROOMITtest
            </div>

            <nav className="nav">
                <ul className="nav-menu">
                    <li className="nav-item"><Link to="/">홈</Link></li>
                    <li className="nav-item"><Link to="/meeting">매칭</Link></li>
                    <li className="nav-item"><Link to="/housing">주거공간</Link></li>
                    <li className="nav-item"><Link to="/chat">채팅</Link></li>
                    <li className="nav-item"><Link to="/Guide">이용 가이드</Link></li>
                    <li className="nav-item"><Link to="/mypages">마이페이지</Link></li>
                </ul>
            </nav>

            <div className="auth-buttons">
                {isLoggedIn ? (
                    <div className="header-profile-section">
                        <Link to="/mypages">
                            <img src={profileImage} alt="프로필" className="profile_image" />
                        </Link>
                        <Link to="/mypages">
                            <button className="btn-profile">프로필 관리</button>
                        </Link>
                        <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
                    </div>
                ) : (
                    <div className="header-login-section">
                        <Link to="/login" state={{ register: false }}>
                            <button className="btn-login">로그인</button>
                        </Link>
                        <Link to="/login" state={{ register: true }}>
                            <button className="btn-signup">가입</button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
