import "./css/LivingSpaceDetail.css";
// import Header from "../Components/Header";
import KakaoMap from "../Components/Kakaomap";
import Loading from "./Loading";
import RetryPage from "./RetryPage";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLivingSpace, deleteLivingSpace, fetchFacilities } from "../services/livingSpace";

const LivingSpaceDetail = () => {
  const { id } = useParams();
  console.log("🔥 useParams()로 받은 id:", id);
  const navigate = useNavigate();

  const [livingSpace, setLivingSpace] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 불러오기
  useEffect(() => {
    const loadLivingSpace = async () => {
      try {
        const data = await fetchLivingSpace(id);
        setLivingSpace(data);

        const facilityData = await fetchFacilities(id); // 편의시설 불러오기
        setFacilities(facilityData);
      } catch (err) {
        setError(err.message || "데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    loadLivingSpace();
  }, [id]);

  const handleMapClick = () => {
    navigate(`/housing/${id}/map`, {
      state: { id, livingSpace },
    });
  };

  // const handleDeleteClick = () => {
  //   if (window.confirm("정말 이 매물을 삭제하시겠습니까?")) {
  //     alert("매물이 삭제되었습니다.");
  //     navigate("/housing");
  //     // TODO: 삭제 API 호출 필요
  //   }
  // };
  const handleDeleteClick = async () => {
    try {
      if (window.confirm("정말 이 매물을 삭제하시겠습니까?")) {
        await deleteLivingSpace(livingSpace.id);
        alert("매물이 삭제되었습니다.");
        navigate("/housing");
      }
      // 삭제 후 목록 갱신 등 처리
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <RetryPage />;

  return (
    <div className="livingSpaceDetail">
      {/* <Header /> */}

      <div className="livingSpaceDetail-content">
        <div className="card livingSpaceDetail-item">
          <div className="image-container">
            <img
              src="https://img.khan.co.kr/news/r/1100xX/2024/07/21/news-p.v1.20240719.96f020c1776f4ef69692b7b6825fb827.webp"
              alt={livingSpace.id}
            />
          </div>

          <div className="info">
            <h3>{livingSpace.id}</h3>
            <p>임대 유형: {livingSpace.type}</p>
            <p>임대료: {livingSpace.price}</p>
            <p>위치: {livingSpace.address}</p>
            <p>전용면적: {livingSpace.area}평</p>
            <p>등록일: {new Date(livingSpace.createdAt).toLocaleDateString()}</p>
            <p>수정일: {new Date(livingSpace.updatedAt).toLocaleDateString()}</p>

            <button className="btn-delete" onClick={handleDeleteClick}>
              🗑 매물 삭제하기
            </button>
          </div>
        </div>

        <div className="card livingSpace-map">
          <KakaoMap livingSpace={livingSpace} id={id} />
          <button id={id} onClick={handleMapClick}>
            크게보기
          </button>
        </div>

        <div className="card livingSpace-feature">
          <h3>주변 편의시설</h3>
          {facilities.length === 0 ? (
            <p>등록된 편의시설 정보가 없습니다.</p>
          ) : (
            <ul>
              {facilities.map((facility) => (
                <li key={facility.id}>
                  <strong>{facility.name}</strong> ({facility.category}) - 위치: {facility.lat},{" "}
                  {facility.lng}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivingSpaceDetail;
