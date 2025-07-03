import React, { useState, useEffect, useCallback } from "react";
import "./css/FilterPanel.css";

// ✅ key 매핑
const categoryKeyMap = {
  "가구 유형": "type",
  지역: "address",
  면적: "area",
  가격대: "price",
  "AI 추천": "aiRecommendation",
};

// ✅ 범위 파싱 함수
const parseRange = (text) => {
  if (text.includes("이상")) {
    const num = parseInt(text);
    return { min: num, max: Infinity };
  }
  if (text.includes("-")) {
    const [min, max] = text
      .replace(/[^0-9-]/g, "")
      .split("-")
      .map(Number);
    return { min, max };
  }
  return null;
};

const FilterHeader = ({ onClose }) => (
  <div className="filterHeader">
    <strong>🔍 필터 설정</strong>
    <button onClick={onClose}>✕</button>
  </div>
);

const SelectedFilters = ({ selectedFiltersLS, onRemove }) => (
  <div className="selectedFilters">
    {selectedFiltersLS.map(({ category, value }) => (
      <div key={`${category}-${value}`} className="filter-tag">
        {category}: {value}
        <span onClick={() => onRemove(category, "상관없음")}> ✕</span>
      </div>
    ))}
  </div>
);

const FilterCategory = ({ category, options, selectedFiltersLS, onToggle }) => {
  const isSelected = (value) =>
    selectedFiltersLS.find((f) => f.category === category && f.value === value);

  return (
    <div className="checkbox-group">
      <strong className="category-title">{category}</strong>
      <ul className="nested-options">
        {options.map((option) => (
          <li key={option}>
            <label className="checkbox-label">
              <input
                type="radio"
                name={category}
                checked={!!isSelected(option)}
                onChange={() => onToggle(category, option)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FilterFooter = ({ onReset, onApply }) => (
  <div className="filterFooter">
    <button className="lvsbtn btn-reset" onClick={onReset}>
      초기화
    </button>
    <button className="lvsbtn btn-apply" onClick={onApply}>
      적용
    </button>
  </div>
);

// ✅ selectedFilters 배열 → 객체로 변환
const getFilterObject = (filters) => {
  const result = {};
  filters.forEach(({ category, value }) => {
    result[category] = value;
  });
  return result;
};

const FilterPanel = ({ open, setOpen, filters, datas, onFilterChange }) => {
  const [selectedFiltersLS, setSelectedFiltersLS] = useState([]);

  const togglePanel = () => setOpen((prev) => !prev);

  const filterDatas = useCallback(
    (filtersObj) => {
      if (!Array.isArray(datas)) return [];

      return datas.filter((data) =>
        filters.every(({ category }) => {
          const selectedValue = filtersObj[category];
          if (!selectedValue || selectedValue === "상관없음") return true;

          const dataKey = categoryKeyMap[category];
          const dataValue = data[dataKey];

          // ✅ 가격대 처리
          if (category === "가격대") {
            const range = parseRange(selectedValue);
            if (!range) return true;
            return dataValue >= range.min && dataValue < range.max;
          }

          // ✅ 면적 처리
          if (category === "면적") {
            const range = parseRange(selectedValue);
            if (!range) return true;
            return dataValue >= range.min && dataValue < range.max;
          }

          // ✅ 기본 문자열 비교
          if (typeof dataValue === "string") {
            return dataValue.includes(selectedValue);
          } else {
            return dataValue === selectedValue;
          }
        })
      );
    },
    [datas, filters]
  );

  useEffect(() => {
    const filtersObj = getFilterObject(selectedFiltersLS);
    onFilterChange(filterDatas(filtersObj));
  }, [selectedFiltersLS, filterDatas, onFilterChange]);

  const toggleFilter = (category, value) => {
    setSelectedFiltersLS((prev) => {
      let updated;
      if (value === "상관없음") {
        updated = prev.filter((f) => f.category !== category);
      } else {
        const existing = prev.find((f) => f.category === category);
        if (existing) {
          updated =
            existing.value === value
              ? prev.filter((f) => f.category !== category)
              : prev.map((f) => (f.category === category ? { category, value } : f));
        } else {
          updated = [...prev, { category, value }];
        }
      }

      localStorage.setItem("selectedFiltersLS", JSON.stringify(updated));
      return updated;
    });
  };

  const clearFilters = () => {
    setSelectedFiltersLS([]);
    localStorage.removeItem("selectedFiltersLS");
  };

  const handleApply = () => togglePanel();

  return (
    <div className={`filterPanel ${open ? "open" : ""}`}>
      <FilterHeader onClose={togglePanel} />
      <SelectedFilters selectedFiltersLS={selectedFiltersLS} onRemove={toggleFilter} />
      <div className="filterOptions">
        {filters.map(({ category, options }) => (
          <FilterCategory
            key={category}
            category={category}
            options={options}
            selectedFiltersLS={selectedFiltersLS}
            onToggle={toggleFilter}
          />
        ))}
      </div>
      <FilterFooter onReset={clearFilters} onApply={handleApply} />
    </div>
  );
};

export default FilterPanel;
