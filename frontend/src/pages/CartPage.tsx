import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateCartItemAsync, removeFromCartAsync, fetchCart } from '../store/slices/cartSlice';
import type { AppDispatch } from '../store/store';
import { useAppSelector } from '../hooks/redux';
import type { CartItem } from '../types';
import ProductImage from '../components/common/ProductImage';
import { formatPrice } from '../utils/currency';

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCartAsync(productId));
    } else {
      dispatch(updateCartItemAsync({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCartAsync(productId));
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-8">
          ¡Agrega algunos productos para empezar a comprar!
        </p>
        <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Carrito de Compras</h1>
        <div className="text-lg">
          {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <ProductImage 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    category={item.product.category}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600">{item.product.description}</p>
                  <p className="text-orange-600 font-semibold">
                    {item.product.price} €
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link 
            to="/checkout" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors block text-center"
          >
            Proceder al Checkout
          </Link>

          <Link 
            to="/products" 
            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors block text-center"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
