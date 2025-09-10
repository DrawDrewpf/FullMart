import { useState, useEffect } from 'react';
import { formatPriceNumber } from '../../utils/currency';

interface Category {
  category: string;
  count: number;
  min_price: number;
  max_price: number;
}

interface PriceRange {
  min_price: number;
  max_price: number;
  total_products: number;
}

interface FiltersData {
  categories: Category[];
  priceRange: PriceRange;
}

interface FilterPanelProps {
  onFiltersChange: (filters: {
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    inStock?: boolean;
  }) => void;
  currentFilters: {
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    inStock?: boolean;
  };
}

const FilterPanel = ({ onFiltersChange, currentFilters }: FilterPanelProps) => {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sliderMinPrice, setSliderMinPrice] = useState<number>(0);
  const [sliderMaxPrice, setSliderMaxPrice] = useState<number>(1000);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    if (filtersData) {
      setSliderMinPrice(currentFilters.minPrice ?? filtersData.priceRange.min_price);
      setSliderMaxPrice(currentFilters.maxPrice ?? filtersData.priceRange.max_price);
    }
  }, [currentFilters.minPrice, currentFilters.maxPrice, filtersData]);

  const fetchFiltersData = async () => {
    try {
      const response = await fetch('/api/products/filters/categories');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setFiltersData(data.data);
        setSliderMinPrice(data.data.priceRange.min_price);
        setSliderMaxPrice(data.data.priceRange.max_price);
      }
    } catch (error) {
      console.error('Error fetching filters data:', error);
      // Set default data if API fails
      const defaultData = {
        categories: [],
        priceRange: { min_price: 0, max_price: 1000, total_products: 0 }
      };
      setFiltersData(defaultData);
      setSliderMinPrice(0);
      setSliderMaxPrice(1000);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = currentFilters.categories || [];
    const isSelected = currentCategories.includes(category);
    
    let newCategories: string[];
    if (isSelected) {
      // Remove category if already selected
      newCategories = currentCategories.filter(cat => cat !== category);
    } else {
      // Add category if not selected
      newCategories = [...currentCategories, category];
    }
    
    onFiltersChange({
      ...currentFilters,
      categories: newCategories.length > 0 ? newCategories : undefined
    });
  };

  const handleMinPriceChange = (value: number) => {
    if (!filtersData) return;
    
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    const currentMaxPrice = typeof sliderMaxPrice === 'number' && !isNaN(sliderMaxPrice) 
      ? sliderMaxPrice 
      : filtersData.priceRange.max_price;
    const newMinPrice = Math.min(safeValue, currentMaxPrice - 10);
    
    setSliderMinPrice(newMinPrice);
    onFiltersChange({
      ...currentFilters,
      minPrice: newMinPrice,
      maxPrice: currentMaxPrice
    });
  };

  const handleMaxPriceChange = (value: number) => {
    if (!filtersData) return;
    
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 1000;
    const currentMinPrice = typeof sliderMinPrice === 'number' && !isNaN(sliderMinPrice) 
      ? sliderMinPrice 
      : filtersData.priceRange.min_price;
    const newMaxPrice = Math.max(safeValue, currentMinPrice + 10);
    
    setSliderMaxPrice(newMaxPrice);
    onFiltersChange({
      ...currentFilters,
      minPrice: currentMinPrice,
      maxPrice: newMaxPrice
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFiltersChange({
      ...currentFilters,
      sortBy,
      sortOrder
    });
  };

  const handleInStockChange = (inStock: boolean) => {
    onFiltersChange({
      ...currentFilters,
      inStock: inStock ? inStock : undefined
    });
  };

  const clearAllFilters = () => {
    if (filtersData) {
      setSliderMinPrice(filtersData.priceRange.min_price);
      setSliderMaxPrice(filtersData.priceRange.max_price);
    }
    onFiltersChange({});
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!filtersData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Error al cargar filtros</p>
      </div>
    );
  }

  const priceMin = filtersData.priceRange.min_price;
  const priceMax = filtersData.priceRange.max_price;
  
  // Safe price values with fallbacks and type checking
  const safeMinPrice = typeof sliderMinPrice === 'number' && !isNaN(sliderMinPrice) 
    ? sliderMinPrice 
    : (typeof priceMin === 'number' && !isNaN(priceMin) ? priceMin : 0);
  
  const safeMaxPrice = typeof sliderMaxPrice === 'number' && !isNaN(sliderMaxPrice) 
    ? sliderMaxPrice 
    : (typeof priceMax === 'number' && !isNaN(priceMax) ? priceMax : 1000);
  
  const safePriceMin = typeof priceMin === 'number' && !isNaN(priceMin) ? priceMin : 0;
  const safePriceMax = typeof priceMax === 'number' && !isNaN(priceMax) ? priceMax : 1000;
  
  const leftPercentage = safePriceMax > safePriceMin 
    ? ((safeMinPrice - safePriceMin) / (safePriceMax - safePriceMin)) * 100 
    : 0;
  const rightPercentage = safePriceMax > safePriceMin 
    ? ((safeMaxPrice - safePriceMin) / (safePriceMax - safePriceMin)) * 100 
    : 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Limpiar todo
        </button>
      </div>

      {/* Ordenamiento */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Ordenar por</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="sort"
              checked={currentFilters.sortBy === 'created_at' && currentFilters.sortOrder === 'DESC'}
              onChange={() => handleSortChange('created_at', 'DESC')}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 accent-orange-600"
            />
            <span className="ml-2 text-sm text-gray-700">Más recientes</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="sort"
              checked={currentFilters.sortBy === 'price' && currentFilters.sortOrder === 'ASC'}
              onChange={() => handleSortChange('price', 'ASC')}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 accent-orange-600"
            />
            <span className="ml-2 text-sm text-gray-700">Precio: menor a mayor</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="sort"
              checked={currentFilters.sortBy === 'price' && currentFilters.sortOrder === 'DESC'}
              onChange={() => handleSortChange('price', 'DESC')}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 accent-orange-600"
            />
            <span className="ml-2 text-sm text-gray-700">Precio: mayor a menor</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="sort"
              checked={currentFilters.sortBy === 'name' && currentFilters.sortOrder === 'ASC'}
              onChange={() => handleSortChange('name', 'ASC')}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 accent-orange-600"
            />
            <span className="ml-2 text-sm text-gray-700">Nombre A-Z</span>
          </label>
        </div>
      </div>

      {/* Disponibilidad */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Disponibilidad</h4>
        <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={currentFilters.inStock || false}
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded accent-orange-600"
          />
          <span className="ml-2 text-sm text-gray-700">Solo productos en stock</span>
        </label>
      </div>

      {/* Rango de precios con slider */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Rango de precios</h4>
        <div className="space-y-4">
          {/* Valores actuales */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{formatPriceNumber(safeMinPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
            <span className="text-sm text-gray-600">{formatPriceNumber(safeMaxPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
          </div>
          
          {/* Slider container */}
          <div className="relative h-6">
            {/* Track */}
            <div className="absolute top-1/2 w-full h-1 bg-gray-200 rounded transform -translate-y-1/2"></div>
            
            {/* Active track */}
            <div 
              className="absolute top-1/2 h-1 bg-orange-500 rounded transform -translate-y-1/2"
              style={{
                left: `${leftPercentage}%`,
                width: `${rightPercentage - leftPercentage}%`
              }}
            ></div>
            
            {/* Min price slider */}
            <input
              type="range"
              min={safePriceMin}
              max={safePriceMax}
              value={safeMinPrice}
              onChange={(e) => handleMinPriceChange(Number(e.target.value))}
              className="absolute w-full h-6 opacity-0 cursor-pointer appearance-none"
              style={{ zIndex: 2 }}
            />
            
            {/* Max price slider */}
            <input
              type="range"
              min={safePriceMin}
              max={safePriceMax}
              value={safeMaxPrice}
              onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
              className="absolute w-full h-6 opacity-0 cursor-pointer appearance-none"
              style={{ zIndex: 2 }}
            />
            
            {/* Min handle */}
            <div 
              className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
              style={{ 
                left: `${leftPercentage}%`,
                top: '50%',
                zIndex: 3
              }}
            ></div>
            
            {/* Max handle */}
            <div 
              className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
              style={{ 
                left: `${rightPercentage}%`,
                top: '50%',
                zIndex: 3
              }}
            ></div>
          </div>
          
          {/* Range indicators */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{safePriceMin} €</span>
            <span>{safePriceMax} €</span>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Categorías</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filtersData.categories.map((category) => (
            <label key={category.category} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentFilters.categories?.includes(category.category) || false}
                  onChange={() => handleCategoryChange(category.category)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded accent-orange-600"
                />
                <span className="ml-3 text-sm text-gray-700 capitalize">{category.category}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
