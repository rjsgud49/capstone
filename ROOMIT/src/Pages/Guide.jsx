import React, { useState } from 'react';
import '../Pages/css/Guide.css';

// 상수 데이터 분리
const SAMPLE_AGREEMENT = `
룸메이트 주거계약 합의서
[ 제1조 (계약 당사자) ]
본 계약은 아래 당사자 간의 자발적인 의사에 따라 체결되었습니다.
[제1입주자]
성명: _____________________
주민등록번호 (생년월일): ____________
연락처: _____________________
[제2입주자]
성명: _____________________
주민등록번호 (생년월일): ____________
연락처: _____________________
[ 제2조 (주거지 정보) ]
주소: ______________________________________
본 주거지의 임대인(건물주)은 __________________이며, 위 당사자는 본 계약을 전대차 또는 공동 임차인 관계로 명시합니다.
(※ 임대인의 서면 동의 여부 체크)
- 임대인의 서면 동의를 받았음
- 임대인의 동의 없이 동거함
[ 제3조 (거주 기간) ]
계약 시작일: ____년 __월 __일
계약 종료일: ____년 __월 __일
조기 퇴거 시 최소 통보 기간: __일 전 통보
조기 퇴거자 부담금: ______원 또는 보증금 반환 지연 가능
[ 제4조 (금전 분담) ]
보증금, 월세, 관리비, 공과금, 인터넷 등은 다음 기준에 따라 분담하며, 연체 시 연체료 ___% / 일 적용됩니다.
- 보증금: ______원 (각자 ___원, 선납, 계약 체결 시 납부)
- 월세: ______원 (각자 ___원, 매월 __일 자동이체)
- 공과금: 실비 청구 후 균등 또는 계량기 기준 분담
- 인터넷/OTT: ______원 (각자 ___원, 매월 __일 납부)
[ 제5조 (생활 규칙) ]
- 청소: 공동 공간 청소는 매주 1회, 번갈아 가며 실시함
- 소음: 오후 10시 이후 고성/음향기기 사용 금지
- 방문자: 외부인 출입 시 사전 통보, 숙박은 동의 시에만 허용
- 냉장고/가전 사용: 개인 식자재 구분, 고가 가전 사용 시 책임 공유
- 흡연/음주: 실내 흡연 금지, 음주는 상대방 방해 시 중단 요청 가능
[ 제6조 (계약 위반 시 책임) ]
고의 또는 중대한 과실로 공동 생활에 해를 끼친 경우, 피해 당사자는 위반자에게 손해배상을 청구할 수 있습니다.
계약 조기 해지 시 위약금: ______원
폭력, 절도, 불법행위 적발 시 즉시 퇴거 및 법적 조치 가능
[ 제7조 (물품 파손 및 손실) ]
고의 또는 과실로 가전, 비품, 주거 시설 파손 시 당사자는 수리비 또는 원상복구 비용 전액을 부담함
[ 제8조 (기타 조항) ]
본 계약은 2부 작성되며, 당사자 각 1부씩 보관함
당사자 서명과 날인을 통해 계약 체결 사실을 입증함
본 계약에 포함되지 않은 사항은 민법 및 일반 관례에 따름
[ 제9조 (분쟁 해결) ]
본 계약에 따른 분쟁이 발생할 경우, 우선 협의로 해결하며, 협의가 실패할 경우 대한민국 법원(거주지 관할 법원)에 소송 제기할 수 있음
[ 서명 및 날인 ]
계약자        서명        날인        날짜
제1입주자    __________________    [ ]        ____년 __월 __일
제2입주자    __________________    [ ]        ____년 __월 __일
`;

// 재사용 가능한 컴포넌트들
const DetailCard = ({ icon, title, children }) => (
  <div className="detail-card">
    <div className="card-icon">{icon}</div>
    <div className="card-content">
      <h3>{title}</h3>
      {children}
    </div>
  </div>
);

const TipBox = ({ children }) => (
  <div className="tip-box">
    <span className="tip-icon">💡</span>
    <strong>Tip:</strong> {children}
  </div>
);

const WarningBox = ({ children }) => (
  <div className="warning-box">
    <span className="warning-icon">⚠️</span>
    {children}
  </div>
);

const CheckList = ({ title, items }) => (
  <div className="checklist">
    <h4>{title}</h4>
    <ul className="checklist-items">
      {items.map((item, index) => (
        <li key={index}>✓ {item}</li>
      ))}
    </ul>
  </div>
);

const ExtraCheckList = ({ title, items }) => (
  <div className="extra-checklist">
    <h4>{title}</h4>
    <ul className="no-bullet">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const GuidelineItem = ({ icon, title, description }) => (
  <div className="guideline-item">
    <span className="guideline-icon">{icon}</span>
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const ResolutionStep = ({ icon, title, description }) => (
  <div className="resolution-step">
    <div className="resolution-icon">{icon}</div>
    <div className="resolution-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const ContactItem = ({ title, phone }) => (
  <div className="contact-item">
    <strong>{title}</strong>
    <p>{phone}</p>
  </div>
);

// 메인 컴포넌트
export default function Guide() {
  const [activeId, setActiveId] = useState(null);

  // 유틸리티 함수들
  const handleDownload = (type) => {
    const fileName = type === 'docx'
      ? '룸메이트_주거계약_합의서.docx'
      : '룸메이트_주거계약_합의서.hwpx';
    const filePath = `/${fileName}`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SAMPLE_AGREEMENT);
  };

  const toggleStep = (stepId) => {
    setActiveId(activeId === stepId ? null : stepId);
  };

  // 단계별 컨텐츠 생성 함수들
  const renderMatchingContent = () => (
    <>
      <DetailCard icon="👥" title="완벽한 룸메이트 찾기">
        <p>매칭 페이지에서 자신과 라이프스타일, 취향이 잘 맞는 룸메이트 후보를 찾아보세요.</p>
      </DetailCard>

      <DetailCard icon="💬" title="실시간 채팅으로 소통">
        <p><strong>'채팅 시작'</strong> 버튼을 눌러 직접 대화를 통해 상호작용하고, 서로에 대한 이해를 깊게 합니다.</p>
      </DetailCard>

      <TipBox>
        생활 패턴, 청소 습관, 개인 공간 선호도 등을 미리 대화해보세요!
      </TipBox>
    </>
  );

  const renderHousingContent = () => (
    <>
      <DetailCard icon="📍" title="맞춤 집 추천">
        <p>매칭이 잘 된 룸메이트와 함께 <strong>주거 페이지</strong>에서 추천 집 리스트를 확인해볼 수 있습니다.</p>
      </DetailCard>

      <DetailCard icon="💰" title="조건별 비교분석">
        <p>조건(보증금, 월세, 전세, 위치 등)에 맞는 집을 함께 비교하고 의견을 나눠보세요.</p>
      </DetailCard>

      <CheckList
        title="🔍 체크포인트"
        items={['교통편 접근성', '주변 편의시설', '보안 및 안전성', '방음 상태']}
      />
    </>
  );

  const renderContractContent = () => (
    <>
      <WarningBox>
        <p>중요한 법적 문제(명의, 보증금, 계약서 작성 등)를 안전하게 해결할 수 있도록 다음 가이드를 참고하세요.</p>
      </WarningBox>

      <div className="contract-guidelines">
        <GuidelineItem
          icon="🏢"
          title="공인중개사 통한 정식 계약"
          description="전문가의 도움으로 안전한 계약 진행"
        />
        <GuidelineItem
          icon="👥"
          title="공동명의 및 보증금 관리"
          description="명의 및 보증금 관리 방법 사전 협의"
        />
        <GuidelineItem
          icon="📝"
          title="계약서 내용 검토"
          description="계약 전 꼭 계약서 내용을 함께 검토"
        />
      </div>

      <ExtraCheckList
        title="📌 계약 전 체크리스트"
        items={[
          '등기부등본 확인 (임대인이 실제 집주인인지 확인)',
          '확정일자 받기 (보증금 보호용)',
          '전입신고 하기'
        ]}
      />

      <ExtraCheckList
        title="💰 보증금 반환 시 유의사항"
        items={[
          '퇴실 청소 여부 확인',
          '공과금 정산 완료 확인',
          '보증금 반환 일정 및 방법 사전 합의'
        ]}
      />

      <ExtraCheckList
        title="🏢 중개사 수수료 안내"
        items={[
          '월세 기준 통상 0.3~0.5개월치',
          '사전 협의 및 영수증 요청하기'
        ]}
      />

      <div className="document-section">
        <h3>📋 추천 합의서 양식</h3>
        <p>안전한 계약 진행을 위한 간단한 합의서를 작성해보세요:</p>
        <div className="document-container">
          <div className="document-header">
            <span className="doc-icon">📄</span>
            <span>룸메이트 주거 계약 합의서</span>
            <button className="copy-btn" onClick={() => handleDownload('hwpx')}>
              📥 한글(.hwp) 다운로드
            </button>
            <button className="copy-btn" onClick={copyToClipboard}>
              📋 복사
            </button>
          </div>
          <pre className="document-sample">{SAMPLE_AGREEMENT}</pre>
        </div>
      </div>
    </>
  );

  const renderDisputeContent = () => (
    <>
      <ResolutionStep
        icon="💬"
        title="1단계: 대화를 통한 해결"
        description="집 파손과 같은 문제는 사용자 간 충분한 대화를 통해 합의를 시도합니다."
      />
      <ResolutionStep
        icon="🤝"
        title="2단계: 플랫폼 중재"
        description="필요시 플랫폼에서 가이드 및 중재 기능을 제공할 예정입니다."
      />
      <ResolutionStep
        icon="⚖️"
        title="3단계: 전문기관 상담"
        description="심각한 분쟁의 경우 관련 전문기관을 통한 해결을 권장합니다."
      />

      <div className="emergency-contacts">
        <h4>🆘 비상 연락처</h4>
        <div className="contact-grid">
          <ContactItem title="소비자분쟁조정위원회" phone="1372" />
          <ContactItem title="법률상담" phone="대한법률구조공단 132" />
        </div>
      </div>
    </>
  );

  // 단계 정의
  const steps = [
    {
      id: 'matching',
      icon: '🤝',
      title: '매칭 단계',
      content: renderMatchingContent()
    },
    {
      id: 'housing',
      icon: '🏡',
      title: '주거지 탐색',
      content: renderHousingContent()
    },
    {
      id: 'contract',
      icon: '📄',
      title: '계약 가이드',
      content: renderContractContent()
    },
    {
      id: 'dispute',
      icon: '⚖️',
      title: '분쟁 해결',
      content: renderDisputeContent()
    }
  ];

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h1 className="guide-title">
          <span className="title-icon">🏠</span>
          ROOMIT 이용 가이드
        </h1>
        <p className="guide-subtitle">
          안전하고 편리한 룸메이트 매칭부터 계약까지, 단계별 가이드를 확인하세요!
        </p>
      </div>

      <div className="guide-content">
        <div className="guide-timeline">
          <div className="timeline-line"></div>
          {steps.map((step, index) => (
            <div className="guide-step" key={step.id}>
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <div
                  className="step-header"
                  onClick={() => toggleStep(step.id)}
                >
                  <h2>{step.icon} {step.title}</h2>
                  <span className="expand-icon">
                    {activeId === step.id ? '−' : '+'}
                  </span>
                </div>
                <div className={`step-details ${activeId === step.id ? 'active' : ''}`}>
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}