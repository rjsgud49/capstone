import "./css/LivingSpace_Item.css";

const LivingSpace_item = ({ LivingSpaceData }) => {
//   const {
//     id,
//     name = "이름 없음",
//     type = "월세/전세",
//     location = "상세위치 없음",
//     maxPersons = 0,
//     presentPersons = 0,
//   } = LivingSpaceData;

  return (
    <div className="livingSpace-item">
      <div className="image-container">
        <img src="/images/room.jpg" alt="Room" />
      </div>
      <div className="info">
        <h3>건물명</h3>
        <p>월세/전세</p>
        <p>상세위치</p>
        <p>최대인원</p>
        <p>현재인원</p>
      </div>
    </div>
  );
};

export default LivingSpace_item;