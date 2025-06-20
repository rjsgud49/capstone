import React, { useState } from 'react';
import '../Pages/css/Guide.css';

const Guide = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="guide-container">
      <div className="guide-header">
        <div className="header-content">
          <h1 className="guide-title">
            <span className="title-icon">🏠</span>
            ROOMIT 이용 가이드
          </h1>
          <p className="guide-subtitle">
            안전하고 편리한 룸메이트 매칭부터 계약까지, 단계별 가이드를 확인하세요!
          </p>
        </div>
      </div>

      <div className="guide-content">
        <div className="guide-timeline">
          <div className="timeline-line"></div>

          {/* Step 1 */}
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <div
                className="step-header"
                onClick={() => toggleSection('matching')}
              >
                <h2>🤝 매칭 단계</h2>
                <span className="expand-icon">
                  {activeSection === 'matching' ? '−' : '+'}
                </span>
              </div>
              <div
                className={`step-details ${activeSection === 'matching' ? 'active' : ''
                  }`}
              >
                <div className="detail-card">
                  <div className="card-icon">👥</div>
                  <div className="card-content">
                    <h3>완벽한 룸메이트 찾기</h3>
                    <p>
                      매칭 페이지에서 자신과 라이프스타일, 취향이 잘 맞는
                      룸메이트 후보를 찾아보세요.
                    </p>
                  </div>
                </div>
                <div className="detail-card">
                  <div className="card-icon">💬</div>
                  <div className="card-content">
                    <h3>실시간 채팅으로 소통</h3>
                    <p>
                      <strong>'채팅 시작'</strong> 버튼을 눌러 직접 대화를 통해
                      상호작용하고, 서로에 대한 이해를 깊게 합니다.
                    </p>
                  </div>
                </div>
                <div className="tip-box">
                  <span className="tip-icon">💡</span>
                  <strong>Tip:</strong> 생활 패턴, 청소 습관, 개인 공간 선호도
                  등을 미리 대화해보세요!
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <div
                className="step-header"
                onClick={() => toggleSection('housing')}
              >
                <h2>🏡 주거지 탐색</h2>
                <span className="expand-icon">
                  {activeSection === 'housing' ? '−' : '+'}
                </span>
              </div>
              <div
                className={`step-details ${activeSection === 'housing' ? 'active' : ''
                  }`}
              >
                <div className="detail-card">
                  <div className="card-icon">📍</div>
                  <div className="card-content">
                    <h3>맞춤 집 추천</h3>
                    <p>
                      매칭이 잘 된 룸메이트와 함께{' '}
                      <strong>주거 페이지</strong>에서 추천 집 리스트를
                      확인해볼 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="detail-card">
                  <div className="card-icon">💰</div>
                  <div className="card-content">
                    <h3>조건별 비교분석</h3>
                    <p>
                      조건(보증금, 월세, 전세, 위치 등)에 맞는 집을 함께 비교하고
                      의견을 나눠보세요.
                    </p>
                  </div>
                </div>
                <div className="checklist">
                  <h4>🔍 체크포인트</h4>
                  <ul>
                    <li>✓ 교통편 접근성</li>
                    <li>✓ 주변 편의시설</li>
                    <li>✓ 보안 및 안전성</li>
                    <li>✓ 방음 상태</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <div
                className="step-header"
                onClick={() => toggleSection('contract')}
              >
                <h2>📄 계약 가이드</h2>
                <span className="expand-icon">
                  {activeSection === 'contract' ? '−' : '+'}
                </span>
              </div>
              <div
                className={`step-details ${activeSection === 'contract' ? 'active' : ''
                  }`}
              >
                <div className="warning-box">
                  <span className="warning-icon">⚠️</span>
                  <p>
                    중요한 법적 문제(명의, 보증금, 계약서 작성 등)를 안전하게
                    해결할 수 있도록 다음 가이드를 참고하세요
                  </p>
                </div>

                <div className="contract-guidelines">
                  <div className="guideline-item">
                    <span className="guideline-icon">🏢</span>
                    <div>
                      <h4>공인중개사 통한 정식 계약</h4>
                      <p>전문가의 도움으로 안전한 계약 진행</p>
                    </div>
                  </div>
                  <div className="guideline-item">
                    <span className="guideline-icon">👥</span>
                    <div>
                      <h4>공동명의 및 보증금 관리</h4>
                      <p>명의 및 보증금 관리 방법 사전 협의</p>
                    </div>
                  </div>
                  <div className="guideline-item">
                    <span className="guideline-icon">📝</span>
                    <div>
                      <h4>계약서 내용 검토</h4>
                      <p>계약 전 꼭 계약서 내용을 함께 검토</p>
                    </div>
                  </div>
                </div>

                <div className="document-section">
                  <h3>📋 추천 합의서 양식</h3>
                  <p>안전한 계약 진행을 위한 간단한 합의서를 작성해보세요:</p>

                  <div className="document-container">
                    <div className="document-header">
                      <span className="doc-icon">📄</span>
                      <span>룸메이트 주거 계약 합의서</span>
                      <button className="copy-btn">📋 복사</button>
                    </div>
                    <pre className="document-sample">
                      {`룸메이트 주거 계약 합의서

1. 계약 당사자
 • 룸메이트1: [이름] (연락처: [전화번호])
 • 룸메이트2: [이름] (연락처: [전화번호])

2. 주거지 정보
 • 주소: [상세 주소]
 • 계약 조건: 보증금 [금액] / 월세 [금액] / 관리비 [금액]
 • 계약 기간: [시작일] ~ [종료일]

3. 비용 분담
 • 보증금 분담 비율: ___% : ___%
 • 월세 분담 비율: ___% : ___%
 • 관리비 및 공과금 분담: ___% : ___%

4. 생활 규칙
 • 공용 공간 사용 규칙
 • 청소 및 정리 분담
 • 방문객 초대 규칙
 • 기타 생활 수칙

5. 시설 및 물품 관리
 • 고의 또는 중대한 과실로 인한 시설 파손 시
   발생한 수리비는 해당 사용자가 배상합니다.
 • 공용 물품 구매 및 관리 방법

6. 계약 해지 조건
 • 사전 통보 기간: [기간]
 • 보증금 반환 절차
 • 기타 해지 관련 사항

작성일: [YYYY년 MM월 DD일]

룸메이트1 서명: ________________    날짜: ________
룸메이트2 서명: ________________    날짜: ________`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="guide-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <div
                className="step-header"
                onClick={() => toggleSection('dispute')}
              >
                <h2>⚖️ 분쟁 해결</h2>
                <span className="expand-icon">
                  {activeSection === 'dispute' ? '−' : '+'}
                </span>
              </div>
              <div
                className={`step-details ${activeSection === 'dispute' ? 'active' : ''
                  }`}
              >
                <div className="dispute-resolution">
                  <div className="resolution-step">
                    <div className="resolution-icon">💬</div>
                    <div className="resolution-content">
                      <h4>1단계: 대화를 통한 해결</h4>
                      <p>
                        집 파손과 같은 문제는 사용자 간 충분한 대화를 통해 합의를 시도합니다.
                      </p>
                    </div>
                  </div>
                  <div className="resolution-step">
                    <div className="resolution-icon">🤝</div>
                    <div className="resolution-content">
                      <h4>2단계: 플랫폼 중재</h4>
                      <p>
                        필요시 플랫폼에서 가이드 및 중재 기능을 제공할 예정입니다.
                      </p>
                    </div>
                  </div>
                  <div className="resolution-step">
                    <div className="resolution-icon">⚖️</div>
                    <div className="resolution-content">
                      <h4>3단계: 전문기관 상담</h4>
                      <p>
                        심각한 분쟁의 경우 관련 전문기관을 통한 해결을 권장합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="emergency-contacts">
                  <h4>🆘 비상 연락처</h4>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <strong>소비자분쟁조정위원회</strong>
                      <p>1372</p>
                    </div>
                    <div className="contact-item">
                      <strong>법률상담</strong>
                      <p>대한법률구조공단 132</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Guide;
