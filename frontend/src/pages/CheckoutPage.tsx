import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchCart } from '../store/slices/cartSlice';
import { useCheckout } from '../hooks/useCheckout';
import ShippingForm from '../components/checkout/ShippingForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total: cartTotal, loading: cartLoading } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [cartLoadAttempted, setCartLoadAttempted] = useState(false);
  
  const {
    shippingData,
    isLoading,
    error,
    updateShippingData,
    submitOrder
  } = useCheckout();

  // Load cart on component mount
  useEffect(() => {
    if (isAuthenticated && !cartLoadAttempted) {
      dispatch(fetchCart()).finally(() => {
        setCartLoadAttempted(true);
      });
    }
  }, [isAuthenticated, cartLoadAttempted, dispatch]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Show loading while cart is being loaded
  if (!cartLoadAttempted || cartLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message if cart is empty after loading
  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega algunos productos antes de proceder al checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOrder();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver al carrito
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">
          Completa tu información para finalizar la compra
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <ShippingForm
              shippingData={shippingData}
              onUpdateShippingData={updateShippingData}
              error={error}
              isLoading={isLoading}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={cartTotal}
              loading={cartLoading}
            />
            
            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || items.length === 0}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  'Finalizar Compra'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
