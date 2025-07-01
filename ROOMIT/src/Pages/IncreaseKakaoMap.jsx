import { useNavigate, useLocation } from "react-router-dom";
import KakaoMap from "../Components/Kakaomap";
import "./css/IncreaseKakaoMap.css";

const IncreaseKakaoMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="increaseKakaoMap">
      <KakaoMap
        livingSpace={data.livingSpace}
        id={data.id}
        style={{ height: "100vh" }}
      />
      <button onClick={goBack}>뒤로가기</button>
    </div>
  );
};

export default IncreaseKakaoMap;
