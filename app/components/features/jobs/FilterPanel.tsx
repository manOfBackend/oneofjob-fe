import { memo } from 'react';
import { Badge } from '~/components/ui/Badge';
import type { JobFilter, CareerType } from '~/lib/types';

interface FilterPanelProps {
  isExpanded: boolean;
  filters: JobFilter;
  companies: string[];
  careers: CareerType[];
  onToggleFilter: (type: 'company' | 'career', value: string) => void;
  onClearAll: () => void;
  onCollapse: () => void;
}

export const FilterPanel = memo<FilterPanelProps>(({
  isExpanded,
  filters,
  companies,
  careers,
  onToggleFilter,
  onClearAll,
  onCollapse,
}) => {
  const hasActiveFilters = filters.companies.length > 0 || filters.careers.length > 0 || filters.keyword;

  return (
    <div className={`transition-all duration-500 overflow-hidden ${
      isExpanded 
        ? 'max-h-screen opacity-100 transform translate-y-0' 
        : 'max-h-0 opacity-0 transform -translate-y-4 pointer-events-none'
    }`}>
      <div className="space-y-6">
        {hasActiveFilters && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                  </svg>
                  적용된 필터
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.keyword && (
                    <Badge variant="primary" onRemove={() => onToggleFilter('company', filters.keyword)}>
                      "{filters.keyword}"
                    </Badge>
                  )}
                  {filters.companies.map((company) => (
                    <Badge 
                      key={company} 
                      variant="primary" 
                      onRemove={() => onToggleFilter('company', company)}
                    >
                      {company}
                    </Badge>
                  ))}
                  {filters.careers.map((career) => (
                    <Badge 
                      key={career} 
                      variant="success" 
                      onRemove={() => onToggleFilter('career', career)}
                    >
                      {career}
                    </Badge>
                  ))}
                </div>
              </div>
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                모든 필터 제거
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FilterSection
            title="회사"
            icon="building"
            count={filters.companies.length}
            items={companies}
            selectedItems={filters.companies}
            onToggle={(value) => onToggleFilter('company', value)}
            gridCols="grid-cols-2"
          />
          
          <FilterSection
            title="직군"
            icon="briefcase"
            count={filters.careers.length}
            items={careers}
            selectedItems={filters.careers}
            onToggle={(value) => onToggleFilter('career', value)}
            gridCols="grid-cols-3"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={onCollapse}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <span>필터 숨기기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

interface FilterSectionProps {
  title: string;
  icon: 'building' | 'briefcase';
  count: number;
  items: string[];
  selectedItems: string[];
  onToggle: (value: string) => void;
  gridCols: string;
}

const FilterSection = memo<FilterSectionProps>(({
  title,
  icon,
  count,
  items,
  selectedItems,
  onToggle,
  gridCols,
}) => {
  const iconColor = icon === 'building' ? 'text-blue-600' : 'text-green-600';
  const bgColor = icon === 'building' ? 'bg-blue-100' : 'bg-green-100';
  const selectedColor = icon === 'building' ? 'bg-blue-600' : 'bg-green-600';
  const badgeColor = icon === 'building' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
          <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon === 'building' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M16 14h.01M12 14h.01M8 14h.01M8 10h.01" />
            )}
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {count > 0 && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}>
            {count}
          </span>
        )}
      </div>
      <div className={`grid ${gridCols} gap-2`}>
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? `${selectedColor} text-white shadow-md`
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
});