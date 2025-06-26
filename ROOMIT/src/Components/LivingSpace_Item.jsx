import "./css/LivingSpace_Item.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const LivingSpaceItem = ({ data }) => {
  // prettier-ignore
  const {
    id = 0,
    address = "",
    area = 0,
    price = 0,
    type = "원룸",
    createdAt = "",
  } = data || {};

  const navigate = useNavigate();

  const handleClick = () => {
    if (id != null) {
      navigate(`/housing/${id}`);
    } else {
      console.warn("❗ 매물 ID가 없습니다. 상세 페이지로 이동할 수 없습니다.");
    }
  };

  return (
    <div className="livingSpace-item" onClick={handleClick}>
      {/* <div className="image-container">
        <img src="/images/room.jpg" alt="Room" />
      </div> */}
      <div className="info">
        <b>{address}</b>
        <p>임대 유형: {type}</p>
        <p>가격: {price}</p>
        <p>면적: {area}평</p>
        <p>위치: {address}</p>
        {/* <p>최대 인원: {maxPersons}</p>
        <p>현재 인원: {presentPersons}</p> */}
        <p>등록일: {new Date(createdAt).toLocaleDateString()}</p>
      </div>
      <div className="btn-container">
        <button className="btn-detail">매물 상세보기</button>
      </div>
    </div>
  );
};

export default React.memo(LivingSpaceItem);
