import { Link } from 'react-router-dom';

const HomePage = () => {
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
          <p className="text-gray-600">Envío gratuito en pedidos superiores a $50</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for featured products */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">Imagen del producto</span>
              </div>
              <h3 className="font-semibold mb-2">Producto {item}</h3>
              <p className="text-gray-600 mb-4">Descripción del producto...</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-orange-600">$99.99</span>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors">Agregar</button>
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
