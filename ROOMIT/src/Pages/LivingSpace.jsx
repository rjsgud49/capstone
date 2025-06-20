import "./css/LivingSpace.css";
// import Header from "../Components/Header";
import LivingSpaceItem from "../Components/LivingSpace_Item";
import FilterPanel from "../Components/FilterPanel";
import { Funnel } from "lucide-react";
import { useState } from "react";

const LivingSpace = ({ LivingSpaceData }) => {
  const [filteredLivingSpaces] = useState(LivingSpaceData);
  const [open, setOpen] = useState(false);

  const togglePanel = () => {
    setOpen(!open);
    console.log(open);
  };

  return (
    <div className="livingSpace">
      {/* <Header /> */}
      <div className="container">
        <div className="title">
          <h1>주거공간</h1>
          <h2>현재 올라온 매물을 확인해보세요!</h2>
          <button className="btn-filter" onClick={togglePanel}>
            <Funnel size={17} />
            필터
          </button>
          <FilterPanel
            togglePanel={togglePanel}
            open={open}
            setOpen={setOpen}
            LivingSpaceData={LivingSpaceData}
          />
        </div>
        <div className="livingSpace-list">
          {filteredLivingSpaces
            .filter((LivingSpaceData) => LivingSpaceData && LivingSpaceData.id) // 존재하고 id가 있는 유저만 통과
            .map((LivingSpaceData, index) => (
              <LivingSpaceItem key={index} LivingSpaceData={LivingSpaceData} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LivingSpace;
