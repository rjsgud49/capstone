import React from 'react';
import './css/RetryPage.css'; // CSS 파일 추가

const RetryPage = ({ errorMessage = "문제가 발생했습니다.", onRetry }) => {
    return (
        <div className="retry-container">
            <div className="retry-box">
                <div className="retry-message">⚠️ {errorMessage}</div>
                <div className="retry-instruction">잠시 후 다시 시도해 주세요.<br />네트워크 상태를 확인하거나 페이지를 새로고침해보세요.</div>
                <div className="retry-buttons">
                    <button className="go-back-button" onClick={() => window.history.back()}>뒤로 가기</button>
                    <button className="retry-button" onClick={onRetry}>다시 시도</button>
                </div>
            </div>
        </div>
    );
};

export default RetryPage;
