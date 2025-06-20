import "./css/FilterPanel.css";
import { Funnel } from "lucide-react";

// const filterOptions = {
//   임대유형: ["임대 유형"],
//   지역: ["상세위치"],
//   최대인원: [""],
//   presentPersons: [""],
// };

const FilterPanel = ({ open, setOpen }) => {
  const togglePanel = () => {
    setOpen(!open);
    console.log(open);
  };

  return (
    <div className="filterPanel">
      <button className="btn-filter">
        <Funnel size={17} onClick={togglePanel} />
        필터
      </button>
      <div className={`filterPanel ${open ? "open" : ""}`}>
        <div className="filterHeader">
          <strong>🔍 필터 설정</strong>
          <button onClick={togglePanel}>✕</button>
        </div>

        <div className="filterOptions">
          <div>▸ 카테고리</div>
          <div>▸ 가격대</div>
          <div>▸ 브랜드</div>
          <div>▸ 평점</div>
        </div>

        <div className="filterFooter">
          <button className="btn btn-reset">초기화</button>
          <button className="btn btn-apply">적용</button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
