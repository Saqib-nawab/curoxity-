import React from 'react';

export interface FilterCategory {
  id: string;
  name: string;
  options: string[];
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (categoryId: string, value: string) => void;
  onClearAll: () => void;
  expandedSections: Record<string, boolean>;
  onSectionToggle: (sectionId: string) => void;
  sortOptions?: string[];
  selectedSort?: string;
  onSortChange?: (val: string) => void;
  onApply?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedFilters,
  onFilterChange,
  onClearAll,
  expandedSections,
  onSectionToggle,
  sortOptions,
  selectedSort,
  onSortChange,
  onApply
}) => {
  return (
    <aside className="w-full lg:w-[335px] shrink-0">
      <div className="bg-white/40 backdrop-blur-md border-2 border-white rounded-[24px] p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-outfit font-normal text-[20px] text-[#0f172a]">Filters</h2>
          <button
            onClick={onClearAll}
            className="font-noto-sans text-[14px] text-brand-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Sort By Filter (Optional) */}
        {sortOptions && (
          <div className="mb-8 font-noto-sans">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => onSectionToggle('Sort By')}
            >
              <span className="font-outfit text-[16px] text-[#0f172a]">Sort By</span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${expandedSections['Sort By'] ? 'rotate-180' : 'rotate-0'}`}
              >
                <path d="M4 6L8 10L12 6" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {expandedSections['Sort By'] && (
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  className="w-full bg-white/40 border border-white rounded-[12px] py-2 px-3 text-[14px] text-[#475569] appearance-none focus:outline-none"
                >
                  {sortOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Filter Sections */}
        {categories.map((category, index) => (
          <div key={category.id} className={`mb-8 font-noto-sans ${index !== 0 || sortOptions ? 'border-t border-slate-200 pt-6' : ''}`}>
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => onSectionToggle(category.id)}
            >
              <span className="font-outfit text-[16px] text-[#0f172a]">{category.name}</span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${expandedSections[category.id] ? 'rotate-180' : 'rotate-0'}`}
              >
                <path d="M4 6L8 10L12 6" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {expandedSections[category.id] && (
              <div className="space-y-4 animate-fadeIn">
                {category.options.map(option => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => onFilterChange(category.id, option)}
                      className={`w-[18px] h-[18px] border-2 rounded flex items-center justify-center transition-all 
                        ${selectedFilters[category.id]?.includes(option)
                          ? 'bg-brand-primary border-brand-primary'
                          : 'bg-white border-border-default hover:border-brand-primary/50'}`}
                    >
                      {selectedFilters[category.id]?.includes(option) && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[14px] transition-colors ${selectedFilters[category.id]?.includes(option) ? 'text-text-primary' : 'text-[#475569]'}`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={onApply}
          className="w-full bg-brand-primary text-white py-3 rounded-[14px] font-noto-sans text-[16px] hover:bg-brand-primary/90 transition-all mt-4 mb-2 shadow-sm"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
