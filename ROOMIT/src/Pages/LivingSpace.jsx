import "./css/LivingSpace.css";
import LivingSpaceItem from "../Components/LivingSpace_Item";
import FilterPanel from "../Components/FilterPanel";
import Loading from "./Loading";
import RetryPage from "./RetryPage";

import { Funnel } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import { fetchAllLivingSpace } from "../services/livingSpace"; // ✅ API 함수 불러오기

const filterOptions = [
  { category: "가구 유형", options: ["상관없음", "원룸", "단독/다가구"] },
  {
    category: "지역",
    options: [
      "상관없음", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산",
      "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
    ],
  },
  { category: "면적", options: ["상관없음", "20-29평", "30-39평", "40-49평", "50평 이상"] },
  { category: "가격대", options: ["상관없음", "100-500만원", "500-1000만원", "1000만원 이상"] },
  { category: "AI 추천", options: ["학교 근처 순", "직장 근처 순", "편의시설 근처 순"] },
];

const LivingSpace = () => {
  const [livingSpaces, setLivingSpaces] = useState([]);
  const [filteredLivingSpaces, setFilteredLivingSpaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 지역 상태 (기본: 상관없음 = 전체 조회)
  const [region, setRegion] = useState("상관없음");

  const loadLivingSpace = useCallback(
    async (regionArg = region) => {
      setIsLoading(true);
      setError(null);
      try {
        // ✅ "상관없음"이면 전체 조회, 아니면 해당 지역만 조회하도록 호출
        const param = regionArg === "상관없음" ? undefined : regionArg;
        const data = await fetchAllLivingSpace(param);
        setLivingSpaces(Array.isArray(data) ? data : []);
        setFilteredLivingSpaces(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("데이터 불러오기 실패");
      } finally {
        setIsLoading(false);
      }
    },
    [region]
  );

  useEffect(() => {
    // 초기 로드: 전체
    loadLivingSpace("상관없음");
  }, [loadLivingSpace]);

  // ✅ FilterPanel이 지역을 바꾸면 서버에서 재조회
  const handleRegionChange = (nextRegion) => {
    setRegion(nextRegion);
    loadLivingSpace(nextRegion);
  };

  const togglePanel = () => setOpen((prev) => !prev);

  if (isLoading) return <Loading />;
  if (error) return <RetryPage errorMessage={error} onRetry={() => loadLivingSpace()} />;

  return (
    <div className="livingSpace">
      <div className="livingSpace-header">
        <h1>주거공간</h1>
        <h2>현재 올라온 매물을 확인해보세요!</h2>
        <div className="header-buttons">
          <button className="btn-filter" onClick={togglePanel}>
            <Funnel size={17} />
            필터
          </button>
        </div>
      </div>

      <FilterPanel
        open={open}
        setOpen={setOpen}
        filters={filterOptions}
        datas={livingSpaces}
        onFilterChange={setFilteredLivingSpaces}
        showFilterButton={false}
        // ✅ 추가: 지역 변경 시 부모에게 알려주기
        onRegionChange={handleRegionChange}
        currentRegion={region}
      />

      <div className="livingSpace-list">
        {Array.isArray(filteredLivingSpaces) &&
          filteredLivingSpaces
            .filter((item) => item && item.name && item.address)
            .map((item, index) => (
              <LivingSpaceItem key={index} data={item} index={index} />
            ))}
      </div>
    </div>
  );
};

export default React.memo(LivingSpace);
