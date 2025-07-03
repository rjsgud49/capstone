// IncreaseKakaoMap.jsx
import { useNavigate, useLocation } from "react-router-dom";
import KakaoMap from "../Components/Kakaomap";
import ToggleButton from "../Components/ToggleFilter"; // ToggleButton 컴포넌트 import
import "./css/IncreaseKakaoMap.css";

const IncreaseKakaoMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const goBack = () => {
    navigate(-1);
  };

  const handleToggle = (label, isOn) => {
    console.log(`${label} 토글 상태: ${isOn}`);
    // 필터링 로직 추가 가능
  };

  return (
    <div className="increaseKakaoMap">
      <KakaoMap livingSpace={data.livingSpace} id={data.id} style="height=100vh" />
      <div className="filter-toggle">
        <ToggleButton label="편의점" onToggle={(isOn) => handleToggle("편의점", isOn)} />
        <ToggleButton label="체육관" onToggle={(isOn) => handleToggle("체육관", isOn)} />
        <ToggleButton label="카페" onToggle={(isOn) => handleToggle("카페", isOn)} />
        <ToggleButton label="기차역" onToggle={(isOn) => handleToggle("기차역", isOn)} />
        <ToggleButton label="버스 정류장" onToggle={(isOn) => handleToggle("버스 정류장", isOn)} />
      </div>
      <button onClick={goBack}>뒤로가기</button>
    </div>
  );
};

export default IncreaseKakaoMap;