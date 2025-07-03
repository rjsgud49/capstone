import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./css/FilterPanel.css";

const categoryKeyMap = {
  "임대 유형": "type",
  지역: "location",
  "최대 인원": "maxPersons",
  면적: "netLeasableArea",
  가격대: "price",
  "AI 추천": "aiRecommendation",
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
      <strong className="category-title"> {category}</strong>
      <ul className="nested-options">
        {options.map((option, index) => (
          <li key={option}>
            <label className="checkbox-label">
              <input
                type="radio"
                name={category}
                checked={!!isSelected(option)}
                onChange={() => onToggle(category, option)}
              />
              {index === options.length - 1 ? ` ${option}` : ` ${option}`}
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

// 💡 filters 배열을 객체로 변환
const getFilterObject = (filters) => {
  const result = {};
  filters.forEach(({ category, value }) => {
    result[category] = value;
  });
  return result;
};

const FilterPanel = ({ open, setOpen, filters, datas, onFilterChange }) => {
  const [selectedFiltersLS, setSelectedFiltersLS] = useState([]);

  const sortFilter = useMemo(
    () => ({ category: "등록순", options: ["상관없음", "최신순", "오래된 순"] }),
    []
  );

  const filterList = useMemo(() => {
    const hasSort = filters.some((f) => f.category === "등록순");
    return hasSort ? filters : [...filters, sortFilter];
  }, [filters, sortFilter]);

  const togglePanel = () => setOpen((prev) => !prev);

  const filterDatas = useCallback(
    (filtersObj) => {
      if (!Array.isArray(datas)) return [];

      let filtered = datas.filter((data) =>
        filterList.every(({ category }) => {
          if (category === "등록순") return true;

          const selectedValue = filtersObj[category];
          if (!selectedValue || selectedValue === "상관없음") return true;

          const dataKey = categoryKeyMap[category];
          const dataValue = data[dataKey];

          if (typeof dataValue === "string") {
            return dataValue.includes(selectedValue);
          } else {
            return dataValue === selectedValue;
          }
        })
      );

      const sortValue = filtersObj["등록순"];
      if (sortValue === "최신순") {
        filtered.sort(
          (a, b) =>
            new Date(b.registrationTime.replaceAll(".", "-")) -
            new Date(a.registrationTime.replaceAll(".", "-"))
        );
      } else if (sortValue === "오래된 순") {
        filtered.sort(
          (a, b) =>
            new Date(a.registrationTime.replaceAll(".", "-")) -
            new Date(b.registrationTime.replaceAll(".", "-"))
        );
      }

      return filtered;
    },
    [datas, filterList]
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
    setsSelectedFiltersLS([]);
    localStorage.removeItem("selectedFiltersLS");
  };

  const handleApply = () => togglePanel();

  return (
    <div className={`filterPanel ${open ? "open" : ""}`}>
      <FilterHeader onClose={togglePanel} />
      <SelectedFilters selectedFiltersLS={selectedFiltersLS} onRemove={toggleFilter} />
      <div className="filterOptions">
        {filterList.map(({ category, options }) => (
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
