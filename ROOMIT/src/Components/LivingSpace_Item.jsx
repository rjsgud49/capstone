import "./css/LivingSpace_Item.css";
import React from "react";
import { useNavigate } from "react-router-dom";

import { formatKoreanCurrency } from "../utils/format";

const LivingSpaceItem = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (data?.id != null) {
      navigate(`/housing/${data.id}`, {
        state: {
          data,
        },
      });
    } else {
      console.warn("❗ 매물 ID가 없습니다. 상세 페이지로 이동할 수 없습니다.");
    }
  };

  return (
    <div className="livingSpace-item" onClick={handleClick}>
      <div className="info">
        <b>{data.name}</b>
        <p>가구 유형: {data.type}</p>
        {data.type === "원룸" && <p>월세: {formatKoreanCurrency(data.monthly)}</p> && (
          <p>보증금: {formatKoreanCurrency(data.deposit)}</p>
        )}
        <p>가격: {formatKoreanCurrency(data.price)}</p>
        <p>면적: {data.area}평</p>
        <p>위치: {data.address}</p>
      </div>
      <div className="btn-container">
        <button className="btn-detail">매물 상세보기</button>
      </div>
    </div>
  );
};

export default React.memo(LivingSpaceItem);