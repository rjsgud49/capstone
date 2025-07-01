import "./css/LivingSpace.css";
import LivingSpaceItem from "../Components/LivingSpace_Item";
import FilterPanel from "../Components/Filter";
import Loading from "./Loading";
import RetryPage from "./RetryPage";

import { Funnel } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import { fetchAllLivingSpace } from "../services/livingSpace"; // ✅ API 함수 불러오기

const filterOptions = [
  { category: "등록순", options: ["상관없음", "최신순", "오래된 순"] },
  { category: "가구 유형", options: ["상관없음", "아파트", "원룸", "단독/다가구"] },
  {
    category: "지역",
    options: // prettier-ignore
    [
      "상관없음", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산",
      "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
    ],
  },
  { category: "최대 인원", options: ["상관없음", "1명", "2명", "3명", "4명", "5명 이상"] },
  { category: "면적", options: ["상관없음", "20-29평", "30-39평", "40-49평", "50평 이상"] },
  { category: "가격대", options: ["상관없음", "0-50만원", "50-100만원", "100만원 이상"] },
  { category: "AI 추천", options: ["학교 근처 순", "직장 근처 순", "편의시설 근처 순"] },
];

const LivingSpace = () => {
  const [livingSpaces, setLivingSpaces] = useState([]);
  const [filteredLivingSpaces, setFilteredLivingSpaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadLivingSpace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllLivingSpace("상인동");
      setLivingSpaces(data);
      setFilteredLivingSpaces(data);
    // } catch (err) {
    //   setError("데이터 불러오기 실패");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLivingSpace();
  }, [loadLivingSpace]);

  const togglePanel = () => {
    setOpen((prev) => !prev);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <RetryPage errorMessage={error} onRetry={loadLivingSpace} />;
  }

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
      />

      <div className="livingSpace-list">
        {console.log("📊 filteredLivingSpaces 상태:", filteredLivingSpaces)}

        {Array.isArray(filteredLivingSpaces) &&
          filteredLivingSpaces
            .filter((item) => item && item.name && item.address)
            .map((item, index) => <LivingSpaceItem key={index} data={item} index={index} />)}
      </div>
    </div>
  );
};

export default React.memo(LivingSpace);
