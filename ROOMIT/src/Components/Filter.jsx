import React, { useState, useEffect, useCallback } from 'react';
import { Funnel } from 'lucide-react';
import './css/Filter.css';

// 필터 헤더 컴포넌트
const FilterHeader = ({ onClose }) => (
    <div className="meetfilterHeader">
        <strong>🔍 필터 설정</strong>
        <button onClick={onClose}>✕</button>
    </div>
);

// 선택된 필터 태그 컴포넌트
const SelectedFilters = ({ selectedFilters, onRemove }) => (
    <div className="meetselectedFilters">
        {selectedFilters.map(({ category, value }) => (
            <div key={`${category}-${value}`} className="meetfilter-tag">
                {category}: {value}
                <span onClick={() => onRemove(category, '상관없음')}> ✕</span>
            </div>
        ))}
    </div>
);

// 필터 카테고리 컴포넌트
const FilterCategory = ({ category, options, selectedFilters, onToggle }) => {
    const isSelected = (value) =>
        selectedFilters.find(f => f.category === category && f.value === value);

    return (
        <div className="meetcheckbox-group">
            <strong className="category-title">{category}</strong>
            <ul className="nested-options">
                {options.map((option, index) => (
                    <li key={option}>
                        <label className="meetcheckbox-label">
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

// 필터 푸터 컴포넌트
const FilterFooter = ({ onReset, onApply }) => (
    <div className="meetfilterFooter">
        <button className="meetbtn meetbtn-reset" onClick={onReset}>초기화</button>
        <button className="meetbtn meetbtn-apply" onClick={onApply}>적용</button>
    </div>
);

// 메인 필터 패널 컴포넌트
const FilterPanel = ({ open, setOpen, filters, items, onFilterChange, showFilterButton = true }) => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const togglePanel = () => setOpen(prev => !prev);

    const filterItems = useCallback((filtersObj) => {
        // items가 유효하지 않으면 빈 배열 반환
        if (!items || !Array.isArray(items)) {
            console.warn('FilterPanel: items is not an array or is undefined', items);
            onFilterChange([]);
            return;
        }

        const filtered = items
        .filter(item => {
            return filters.every(({ category, path, filterFn }) => {
                const selectedValue = filtersObj[category];
                if (!selectedValue || selectedValue === '상관없음') return true;

                // 동적 속성 접근
                const getNestedValue = (obj, path) => {
                    try {
                        return path.split('.').reduce((prev, curr) => {
                            return prev && prev[curr] !== undefined ? prev[curr] : undefined;
                        }, obj);
                    } catch {
                        return undefined;
                    }
                };

                const itemValue = getNestedValue(item, path);

                // filterFn이 제공된 경우 사용, 아니면 기본적으로 정확한 일치 확인
                if (filterFn) {
                    return filterFn(itemValue, selectedValue);
                }
                return itemValue === selectedValue;
            });
        });

        onFilterChange(filtered);
    }, [items, filters, onFilterChange]);

    useEffect(() => {
        const saved = localStorage.getItem('selectedFilters');
        if (saved && items && Array.isArray(items)) {
            const parsed = JSON.parse(saved);
            setSelectedFilters(parsed);
            const result = {};
            parsed.forEach(({ category, value }) => {
                result[category] = value;
            });
            filterItems(result);
        }
    }, [filterItems, items]);

    const toggleFilter = (category, value) => {
        setSelectedFilters((prev) => {
            let updated;
            if (value === '상관없음') {
                updated = prev.filter(f => f.category !== category);
            } else {
                const existing = prev.find(f => f.category === category);
                if (existing) {
                    updated = existing.value === value
                        ? prev.filter(f => f.category !== category)
                        : prev.map(f => f.category === category ? { category, value } : f);
                } else {
                    updated = [...prev, { category, value }];
                }
            }

            localStorage.setItem('selectedFilters', JSON.stringify(updated));
            const result = {};
            updated.forEach(({ category, value }) => {
                result[category] = value;
            });
            filterItems(result);
            return updated;
        });
    };

    const clearFilters = () => {
        setSelectedFilters([]);
        localStorage.removeItem('selectedFilters');
        filterItems({});
    };

    const handleApply = () => {
        const result = {};
        selectedFilters.forEach(({ category, value }) => {
            result[category] = value;
        });
        filterItems(result);
        togglePanel();
    };

    return (
        <div className="meetfilterPanel">
            {showFilterButton && (
                <button className="meetbtn-filter" onClick={togglePanel}>
                    <Funnel size={17} />
                    필터
                </button>
            )}
            <div className={`meetfilterPanel ${open ? 'open' : ''}`}>
                <FilterHeader onClose={togglePanel} />
                <SelectedFilters selectedFilters={selectedFilters} onRemove={toggleFilter} />
                <div className="meetfilterOptions">
                    {filters.map(({ category, options }) => (
                        <FilterCategory
                            key={category}
                            category={category}
                            options={options}
                            selectedFilters={selectedFilters}
                            onToggle={toggleFilter}
                        />
                    ))}
                </div>
                <FilterFooter onReset={clearFilters} onApply={handleApply} />
            </div>
        </div>
    );
};

export default FilterPanel;