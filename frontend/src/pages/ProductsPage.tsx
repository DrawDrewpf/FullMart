import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../store/slices/cartSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { useAppSelector } from '../hooks/redux';
import type { AppDispatch } from '../store/store';
import type { Product } from '../types';
import ProductImage from '../components/common/ProductImage';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Cargar productos al montar el componente
    dispatch(fetchProducts({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    dispatch(addToCartAsync({
      productId: product.id,
      quantity: 1
    }));
    alert(`${product.name} agregado al carrito`);
  };

  // Obtener categorías únicas de los productos
  const categories = Array.isArray(products) ? [...new Set(products.map(product => product.category))] : [];

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <p className="text-gray-600">Encuentra exactamente lo que buscas</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar productos
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen del producto - clickeable para ir al detalle */}
            <Link to={`/product/${product.id}`} className="block">
              <div className="h-48 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden">
                <ProductImage 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  fallbackText="Imagen no disponible"
                  category={product.category}
                />
              </div>
            </Link>
            
            <div className="p-6 space-y-2">
              {/* Nombre del producto - clickeable para ir al detalle */}
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-lg hover:text-orange-600 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-bold text-orange-600">
                  €{product.price}
                </span>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500">
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
