// Footer.jsx
import React from 'react';
import './css/Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <h2>RoomIT</h2>
                    <p>청년 공동 주거 매칭 서비스</p>
                </div>
                <div className="footer-links">
                    <div className="footer-links-column">
                        <h3>서비스</h3>
                        <ul>
                            <li><Link to="/mypage">룸메이트 매칭</Link></li>
                            <li>주거공간 찾기</li>
                            <li>생활규칙 관리</li>
                            <li>신뢰도 평가</li>
                        </ul>
                    </div>
                    <div className="footer-links-column">
                        <h3>회사</h3>
                        <ul>
                            <li>서비스 소개</li>
                            <li>이용약관</li>
                            <li>개인정보처리방침</li>
                            <li>문의하기</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-contact">
                    <h3>연락처</h3>
                    <p>이메일: info@roomit.co.kr</p>
                    <p>전화: 02-123-4567</p>
                    <div className="social-icons">
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p>© 2025 RoomIT. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;