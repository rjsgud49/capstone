import "./css/LivingSpaceDetail.css";
import KakaoMap from "../Components/Kakaomap";
import Loading from "./Loading";
import RetryPage from "./RetryPage";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchListingById, fetchAiSummary } from "../services/livingSpace"; // ✅ 새로운 fetch 함수 사용

const LivingSpaceDetail = () => {
  const { id } = useParams(); // 문자열로 들어옴
  const navigate = useNavigate();

  const [livingSpace, setLivingSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchListingById(id); // ✅ 백엔드에서 ID로 직접 요청
        setLivingSpace(data);

        const aiResult = await fetchAiSummary(data); // AI 요약도 요청
        setAiSummary(aiResult ?? ""); // summary 키만 저장
      } catch (err) {
        setError(err.message || "에러 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMapClick = () => {
    navigate(`/housing/${id}/map`, {
      state: { id, livingSpace },
    });
  };

  if (loading) return <Loading />;
  if (error) return <RetryPage errorMessage={error} />;

  return (
    <div className="livingSpaceDetail">
      <div className="livingSpaceDetail-content">
        <div className="card livingSpaceDetail-item">
          <div className="info">
            <h3>{livingSpace.name}</h3>
            <p>가구 유형: {livingSpace.type}</p>
            <p>보증금: {livingSpace.deposit}</p>
            {livingSpace.type !== "아파트" && <p>월세: {livingSpace.monthly}</p>}
            <p>임대료: {livingSpace.price}</p>
            <p>위치: {livingSpace.address}</p>
            <p>전용면적: {livingSpace.area}평</p>
          </div>
        </div>

        <div className="card livingSpace-map">
          <KakaoMap livingSpace={livingSpace} />
          <button onClick={handleMapClick}>크게보기</button>
        </div>

        <div className="card livingSpace-feature">
          <h1>AI 추천 요약</h1>
          <p>{aiSummary || "추천 문장을 불러오는 중이거나 없습니다."}</p>
        </div>
      </div>
    </div>
  );
};

export default LivingSpaceDetail;
