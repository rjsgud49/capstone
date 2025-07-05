import { useNavigate, useLocation } from "react-router-dom";
import KakaoMap from "../Components/Kakaomap";
import ToggleButton from "../Components/ToggleFilter";
import "./css/IncreaseKakaoMap.css";
import { useEffect, useState } from "react";
import axios from "axios";

const IncreaseKakaoMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [facilityData, setFacilityData] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({});

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const address = data.livingSpace?.address || "대구 달서구 상인동 1456-11";
        const res = await axios.get(
          `http://34.122.44.97:8888/api/facilities?query=${encodeURIComponent(address)}`
        );
        setFacilityData(res.data);
      } catch (err) {
        console.error("시설 정보 가져오기 실패:", err);
      }
    };

    fetchFacilities();
  }, [data]);

  const goBack = () => navigate(-1);

  const handleToggle = (label, isOn) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [label]: isOn,
    }));
  };

  return (
    <div className="increaseKakaoMap">
      <KakaoMap
        livingSpace={data.livingSpace}
        id={data.id}
        facilityData={facilityData}
        selectedCategories={selectedCategories}
        style={{ height: "100vh" }}
      />

      <div className="filter-toggle">
        <ToggleButton label="편의점" onToggle={(isOn) => handleToggle("편의점", isOn)} />
        <ToggleButton label="체육관" onToggle={(isOn) => handleToggle("체육관", isOn)} />
        <ToggleButton label="카페" onToggle={(isOn) => handleToggle("카페", isOn)} />
        <ToggleButton label="기차역" onToggle={(isOn) => handleToggle("기차역", isOn)} />
        <ToggleButton label="병원" onToggle={(isOn) => handleToggle("병원", isOn)} />
      </div>

      <button onClick={goBack}>뒤로가기</button>
    </div>
  );
};

export default IncreaseKakaoMap;
