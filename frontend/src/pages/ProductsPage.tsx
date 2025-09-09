import { useState } from 'react';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - será reemplazado por datos reales del backend
  const mockProducts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Producto ${i + 1}`,
    description: `Descripción del producto ${i + 1}`,
    price: (i + 1) * 25.99,
    category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Clothing' : 'Home',
    stock: 10,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  }));

  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-bold text-orange-600">
                  ${product.price.toFixed(2)}
                </span>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  onClick={() => {
                    // TODO: Implement add to cart
                    alert(`Agregado ${product.name} al carrito`);
                  }}
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
