import React, { useState, useEffect, useCallback } from 'react';
import { formatPrice } from '../utils/currency';
import { adminApi } from '../services/api';
import ProductModal from '../components/admin/ProductModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import { 
  CubeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsResponse {
  data: Product[];
  pagination: ProductsPagination;
}

const AdminProducts: React.FC = () => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Modal states
  const [productModal, setProductModal] = useState<{
    isOpen: boolean;
    mode: 'view' | 'edit' | 'create';
    productId?: number;
  }>({
    isOpen: false,
    mode: 'create'
  });
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId?: number;
    productName?: string;
    loading: boolean;
  }>({
    isOpen: false,
    loading: false
  });

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      const response = await adminApi.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: { page: number; limit: number; search?: string; category?: string } = {
        page: currentPage,
        limit: 20,
      };
      
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }
      
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      const response = await adminApi.getProducts(params);
      
      // Debug: Ver qué estructura devuelve el backend
      console.log('Admin Products Response:', response.data);
      
      // El backend devuelve { success: true, data: { products: [...], pagination: {...} } }
      setData({
        data: response.data.data.products,
        pagination: response.data.data.pagination
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const formatCurrency = (amount: number) => {
    return formatPrice(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Electronics': 'bg-blue-100 text-blue-800',
      'Clothing': 'bg-purple-100 text-purple-800',
      'Home': 'bg-green-100 text-green-800',
      'Garden': 'bg-green-100 text-green-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Books': 'bg-yellow-100 text-yellow-800',
      'Toys': 'bg-pink-100 text-pink-800',
      'Automotive': 'bg-red-100 text-red-800',
      'Health': 'bg-indigo-100 text-indigo-800',
      'Beauty': 'bg-purple-100 text-purple-800',
      'Food': 'bg-green-100 text-green-800',
      'Music': 'bg-blue-100 text-blue-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Sin stock', color: 'text-red-600' };
    if (quantity < 10) return { text: 'Stock bajo', color: 'text-yellow-600' };
    return { text: 'En stock', color: 'text-green-600' };
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // Modal handlers
  const openProductModal = (mode: 'view' | 'edit' | 'create', productId?: number) => {
    setProductModal({
      isOpen: true,
      mode,
      productId
    });
  };

  const closeProductModal = () => {
    setProductModal({
      isOpen: false,
      mode: 'create'
    });
  };

  const openDeleteModal = (productId: number, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
      loading: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      loading: false
    });
  };

  const handleDeleteProduct = async () => {
    if (!deleteModal.productId) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));
    
    try {
      await adminApi.deleteProduct(deleteModal.productId);
      closeDeleteModal();
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete product:', err);
      // Could add a toast notification here
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleProductSuccess = () => {
    fetchProducts(); // Refresh the list after create/edit
  };

  const renderPagination = () => {
    if (!data?.pagination) return null;

    const { page, pages } = data.pagination;
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pages, startPage + maxVisiblePages - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{((page - 1) * 20) + 1}</span> a{' '}
              <span className="font-medium">{Math.min(page * 20, data.pagination.total)}</span> de{' '}
              <span className="font-medium">{data.pagination.total}</span> productos
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                    pageNum === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pages}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CubeIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          </div>
          <button 
            onClick={() => openProductModal('create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-4">
          <div className="relative max-w-md flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data && data.data.length > 0 ? data.data.map((product: Product) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            src={product.image_url}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                          <div className="text-xs text-gray-400">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock_quantity} unidades</div>
                      <div className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.is_active ? (
                          <>
                            <EyeIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">Activo</span>
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm text-red-600">Inactivo</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openProductModal('view', product.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver producto"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openProductModal('edit', product.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Editar producto"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar producto"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Cargando productos...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Empty State */}
      {data?.data.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Intenta cambiar los filtros de búsqueda.' 
              : 'Comienza agregando tu primer producto.'}
          </p>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={closeProductModal}
        productId={productModal.productId}
        mode={productModal.mode}
        onSuccess={handleProductSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        productName={deleteModal.productName || ''}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default AdminProducts;
