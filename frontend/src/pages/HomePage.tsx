import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { addToCartAsync } from '../store/slices/cartSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { useAppSelector } from '../hooks/redux';
import type { AppDispatch } from '../store/store';
import type { Product } from '../types';
import ProductImage from '../components/common/ProductImage';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    // Cargar productos al montar el componente
    dispatch(fetchProducts({ limit: 4 }));
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

  // Seleccionar los primeros 4 productos como destacados
  const featuredProducts = products.slice(0, 4);
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r  bg-orange-400 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenido a FullMart
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Descubre los mejores productos al mejor precio. Tu e-commerce de confianza.
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-white text-orange-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Ver Productos
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
          <p className="text-gray-600">Envío gratuito en pedidos superiores a 50€</p>
        </div>
        
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Pago Seguro</h3>
          <p className="text-gray-600">Tus datos están protegidos con encriptación SSL</p>
        </div>
        
        <div className="text-center p-6">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
          <p className="text-gray-600">Estamos aquí para ayudarte cuando lo necesites</p>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
              
              <div className="p-4 space-y-2">
                {/* Nombre del producto - clickeable para ir al detalle */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-orange-600 transition-colors cursor-pointer line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-orange-600">
                    €{product.price}
                  </span>
                  <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/products" className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Ver Todos los Productos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
