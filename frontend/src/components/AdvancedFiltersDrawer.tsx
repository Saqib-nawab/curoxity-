import React, { useEffect, useState } from 'react';
import type { FilterCategory } from './FilterSidebar';

interface AdvancedFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (categoryId: string, value: string) => void;
  onClearAll: () => void;
  onApply: () => void;
  expandedSections: Record<string, boolean>;
  onSectionToggle: (sectionId: string) => void;
}

const AdvancedFiltersDrawer: React.FC<AdvancedFiltersDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onApply,
  expandedSections,
  onSectionToggle,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to trigger animation
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const totalSelected = Object.values(selectedFilters).flat().length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`relative w-full max-w-[420px] h-full bg-white shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-outfit font-normal text-[22px] text-[#0f172a]">Advanced Filters</h2>
            {totalSelected > 0 && (
              <span className="bg-brand-primary/10 text-brand-primary text-[12px] font-bold px-2 py-0.5 rounded-full">
                {totalSelected.toString().padStart(2, '0')}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="font-noto-sans border-b border-gray-50 pb-6 last:border-0">
              <div 
                className="flex justify-between items-center mb-4 cursor-pointer group"
                onClick={() => onSectionToggle(category.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-outfit text-[17px] text-[#0f172a] group-hover:text-brand-primary transition-colors">
                    {category.name}
                  </span>
                  {selectedFilters[category.id]?.length > 0 && (
                    <span className="text-brand-primary text-[12px] font-medium">
                      ({selectedFilters[category.id].length})
                    </span>
                  )}
                </div>
                <svg 
                  width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-300 ${expandedSections[category.id] ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {expandedSections[category.id] && (
                <div className="grid grid-cols-1 gap-3 animate-fadeIn">
                  {category.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          onFilterChange(category.id, option);
                        }}
                        className={`w-5 h-5 border-2 rounded-[6px] flex items-center justify-center transition-all shadow-sm
                          ${selectedFilters[category.id]?.includes(option)
                            ? 'bg-brand-primary border-brand-primary' 
                            : 'bg-white border-[#cbd5e1] group-hover:border-brand-primary/50'}`}
                      >
                        {selectedFilters[category.id]?.includes(option) && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[15px] transition-colors ${selectedFilters[category.id]?.includes(option) ? 'text-text-primary font-medium' : 'text-[#475569]'}`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
             <button 
              onClick={onClearAll}
              className="text-gray-500 text-[14px] font-medium hover:text-red-500 transition-colors"
            >
              Clear All ({totalSelected})
            </button>
          </div>
          <button 
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-full bg-brand-primary text-white py-4 rounded-[16px] font-outfit text-[16px] font-medium hover:bg-brand-primary/90 transition-all shadow-md shadow-brand-primary/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersDrawer;
