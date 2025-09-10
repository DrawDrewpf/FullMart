import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '../types';
import ProductCard from '../components/common/ProductCard';
import FilterPanel from '../components/common/FilterPanel';
import PaginationControls from '../components/common/PaginationControls';

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Cache interface
interface CacheEntry {
  data: Product[];
  pagination: ProductsResponse['pagination'];
  timestamp: number;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<{
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    inStock?: boolean;
  }>({});
  
  // Cache para evitar recargas innecesarias
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const productsHeaderRef = useRef<HTMLDivElement>(null);
  
  // Scroll al header de productos
  const scrollToProducts = () => {
    if (productsHeaderRef.current) {
      productsHeaderRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  
  // Fetch products function with cache inteligente
  const fetchProducts = useCallback(async (page = 1, search = '', currentFilters: typeof filters = {}) => {
    // Generar clave de cache
    const generateCacheKey = (p: number, s: string, f: typeof filters): string => {
      return JSON.stringify({ page: p, search: s, filters: f });
    };
    
    // Verificar si hay datos en cache válidos
    const getCachedData = (cacheKey: string): CacheEntry | null => {
      const cached = cache.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached;
      }
      return null;
    };
    
    const cacheKey = generateCacheKey(page, search, currentFilters);
    
    // Verificar cache primero
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setProducts(cachedData.data);
      setCurrentPage(cachedData.pagination.page);
      setTotalPages(cachedData.pagination.totalPages);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }

      // Add filters to params
      if (currentFilters.categories && currentFilters.categories.length > 0) {
        // Send categories as comma-separated string
        const categoriesString = currentFilters.categories.join(',');
        params.append('category', categoriesString);
      }
      if (currentFilters.minPrice !== undefined) {
        params.append('minPrice', currentFilters.minPrice.toString());
      }
      if (currentFilters.maxPrice !== undefined) {
        params.append('maxPrice', currentFilters.maxPrice.toString());
      }
      if (currentFilters.sortBy) {
        params.append('sortBy', currentFilters.sortBy);
      }
      if (currentFilters.sortOrder) {
        params.append('sortOrder', currentFilters.sortOrder);
      }
      if (currentFilters.inStock) {
        params.append('inStock', 'true');
      }

      const finalUrl = `/api/products?${params.toString()}`;
      const response = await fetch(finalUrl);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: ProductsResponse = await response.json();
      
      if (data.success) {
        // Guardar en cache
        cache.current.set(cacheKey, {
          data: data.data,
          pagination: data.pagination,
          timestamp: Date.now()
        });
        
        setProducts(data.data);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    fetchProducts(1, '', {});
  }, [fetchProducts]);

  // Handle search with debouncing and filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
      }
      setCurrentPage(1);
      fetchProducts(1, searchInput, filters);
    }, searchInput !== searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchTerm, filters, fetchProducts]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, searchTerm, filters);
  };

  const handlePageChangeWithScroll = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, searchTerm, filters);
    scrollToProducts();
  };

  const handleRetry = () => {
    fetchProducts(currentPage, searchTerm, filters);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
    fetchProducts(1, '', filters);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar productos</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Productos</h1>
          
          {/* Search Bar */}
          <div className="max-w-md relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Buscar productos..."
              />
              {searchInput && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Buscando: <strong>"{searchTerm}"</strong>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:w-1/4">
            <FilterPanel 
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
            />
          </div>

          {/* Products Content */}
          <div className="lg:w-3/4">
            {/* Products Header con referencia para scroll */}
            <div ref={productsHeaderRef} className="mb-6">
              {!loading && products.length > 0 && (
                <p className="text-sm text-gray-600">
                  Mostrando página {currentPage} de {totalPages}
                  {searchTerm && ` para "${searchTerm}"`}
                </p>
              )}
              
              {/* Paginación Superior */}
              {!loading && products.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-4"
                  shouldScrollOnChange={false}
                />
              )}
            </div>
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Products Found */}
            {!loading && products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `No encontramos productos que coincidan con "${searchTerm}"`
                    : 'Por el momento no hay productos en el catálogo'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Ver todos los productos
                  </button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      size="medium"
                      showDescription={true}
                    />
                  ))}
                </div>

                {/* Paginación Inferior */}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChangeWithScroll}
                  className="mt-12"
                  shouldScrollOnChange={true}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
