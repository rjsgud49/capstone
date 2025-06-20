import React, { useEffect, useState } from 'react';
import '../Pages/css/Notfound.css';

const NotFoundPage = () => {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  return (
    <div className="not-found-container">
      <div className={`floating-icons ${animationStarted ? 'animate' : ''}`}>
        {/* 화면 전체에 골고루 배치된 더 큰 아이콘들 */}
        <div className="icon roommate-icon" style={{ top: '8%', left: '15%' }}>👩</div>
        <div className="icon roommate-icon" style={{ bottom: '12%', right: '18%' }}>👨</div>
        <div className="icon key" style={{ top: '15%', right: '15%' }}>🔑</div>
        <div className="icon house" style={{ top: '45%', left: '8%' }}>🏠</div>
        <div className="icon chat" style={{ bottom: '35%', left: '25%' }}>💬</div>
        <div className="icon money" style={{ top: '25%', right: '10%' }}>💰</div>
        <div className="icon star" style={{ top: '5%', left: '45%' }}>⭐</div>
        <div className="icon calendar" style={{ bottom: '15%', left: '40%' }}>📅</div>
        <div className="icon location" style={{ top: '15%', right: '40%' }}>📍</div>
        <div className="icon handshake" style={{ bottom: '25%', right: '30%' }}>🤝</div>
        <div className="icon warning" style={{ top: '70%', right: '15%' }}>⚠️</div>
        <div className="icon search" style={{ bottom: '8%', left: '15%' }}>🔍</div>
        <div className="icon roommate-icon" style={{ top: '35%', left: '30%' }}>👱‍♀️</div>
        <div className="icon roommate-icon" style={{ bottom: '40%', right: '5%' }}>👱</div>
        <div className="icon house" style={{ top: '65%', left: '22%' }}>🏘️</div>
        <div className="icon heart" style={{ top: '20%', left: '60%' }}>❤️</div>
        <div className="icon check" style={{ bottom: '60%', right: '25%' }}>✅</div>
        <div className="icon chat" style={{ top: '55%', right: '35%' }}>💭</div>
      </div>

      {/* 404 메인 텍스트 */}
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-subtitle">룸메이트를 찾을 수 없습니다</h2>
      </div>

      {/* 에러 메시지 박스 */}
      <div className="error-box">
        <div className="error-box-message">이런! 잘못된 주소입니다</div>
        <div className="error-box-instruction">
          찾으시는 페이지를 찾을 수 없습니다. 아마도 다른 집으로 이사했을 거예요.
        </div>
        <div className="error-buttons">
          <button className="go-back-button" onClick={() => window.history.back()}>
            뒤로 가기
          </button>
          <button className="find-roommate-button" onClick={() => window.location.href = '/meeting'}>
            룸메이트 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;