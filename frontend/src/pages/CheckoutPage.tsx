import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { clearCartAsync, fetchCart } from '../store/slices/cartSlice';
import { ordersApi } from '../services/api';
import type { CreateOrderRequest } from '../types';
import { formatPrice } from '../utils/currency';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total: cartTotal, loading: cartLoading } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartLoadAttempted, setCartLoadAttempted] = useState(false);
  const [shippingData, setShippingData] = useState<CreateOrderRequest>({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'España',
    payment_method: 'credit_card'
  });

  // Load cart on component mount
  useEffect(() => {
    if (isAuthenticated && !cartLoadAttempted) {
      dispatch(fetchCart()).finally(() => {
        setCartLoadAttempted(true);
      });
    }
  }, [dispatch, isAuthenticated, cartLoadAttempted]);

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

  // Calculate totals
  const subtotal = cartTotal;
  const taxRate = 0.21; // 21% IVA
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 50 ? 0 : 5.99; // Free shipping over €50
  const total = subtotal + taxAmount + shippingAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await ordersApi.createOrder(shippingData);
      dispatch(clearCartAsync());
      navigate('/orders', { state: { orderCreated: true } });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error('❌ Order creation failed:', error);
      setError(error.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Datos de Envío</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="shipping_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="shipping_name"
                      name="shipping_name"
                      required
                      value={shippingData.shipping_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping_email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="shipping_email"
                      name="shipping_email"
                      required
                      value={shippingData.shipping_email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping_phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="shipping_phone"
                      name="shipping_phone"
                      value={shippingData.shipping_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="shipping_address"
                      name="shipping_address"
                      required
                      value={shippingData.shipping_address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Calle Principal 123, 1º A"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      id="shipping_city"
                      name="shipping_city"
                      required
                      value={shippingData.shipping_city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Madrid"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-2">
                      Provincia *
                    </label>
                    <input
                      type="text"
                      id="shipping_state"
                      name="shipping_state"
                      required
                      value={shippingData.shipping_state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Madrid"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping_postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                      Código postal *
                    </label>
                    <input
                      type="text"
                      id="shipping_postal_code"
                      name="shipping_postal_code"
                      required
                      value={shippingData.shipping_postal_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="28001"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <select
                      id="shipping_country"
                      name="shipping_country"
                      required
                      value={shippingData.shipping_country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="España">España</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Francia">Francia</option>
                      <option value="Italia">Italia</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                      Método de pago *
                    </label>
                    <select
                      id="payment_method"
                      name="payment_method"
                      required
                      value={shippingData.payment_method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="credit_card">Tarjeta de Crédito</option>
                      <option value="debit_card">Tarjeta de Débito</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Transferencia Bancaria</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.image_url || '/placeholder-product.png'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>IVA (21%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Envío</span>
                  <span>{shippingAmount === 0 ? 'GRATIS' : formatPrice(shippingAmount)}</span>
                </div>
                {subtotal > 50 && (
                  <div className="text-sm text-green-600 mb-4">
                    🎉 ¡Envío gratuito por compras superiores a €50!
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
