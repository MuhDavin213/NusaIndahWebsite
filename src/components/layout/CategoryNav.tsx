import { useMemo } from 'react';
import { useCategories } from '../../hooks/useCategories';

type CategoryNavProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  const { categories, isLoading, error } = useCategories();
  const displayCategories = useMemo(
    () => ['Semua', ...categories.filter((category) => category !== 'Semua')],
    [categories]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
      <h3 className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Kategori Produk</h3>
      {isLoading && (
        <p className="mb-2 text-xs text-gray-500">Memuat kategori dari Firebase...</p>
      )}
      {!isLoading && error && (
        <p className="mb-2 text-xs text-red-600">Kategori gagal dimuat: {error}</p>
      )}
      {/* Desktop: flex-wrap, Mobile: horizontal scroll */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {displayCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              selectedCategory === category
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Mobile: horizontal scroll with visible scrollbar */}
      <div className="sm:hidden flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 category-scroll">
        {displayCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 text-sm ${
              selectedCategory === category
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
