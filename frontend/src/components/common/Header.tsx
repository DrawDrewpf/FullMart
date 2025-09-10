import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useAppSelector } from '../../hooks/redux';
import type { AppDispatch } from '../../store/store';

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600">
            🛒 FullMart
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-600 transition-colors">
              Productos
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-gray-700 hover:text-orange-600 transition-colors">
                Mis Pedidos
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Hola, {user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
