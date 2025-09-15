import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ordersApi } from '../services/api';
import { formatPrice } from '../utils/currency';
import type { Order } from '../types';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      if (!orderId) return;
      
      const response = await ordersApi.getOrder(parseInt(orderId));
      if (response.data.success && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Orden no encontrada</h1>
          <button
            onClick={() => navigate('/orders')}
            className="text-orange-600 hover:text-orange-700"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600">
            Tu pedido ha sido procesado exitosamente
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pedido #{order.order_number}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Productos ordenados:</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product_image_url || '/placeholder-image.jpg'}
                      alt={item.product_name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.total_price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Información de envío:</h3>
            <p className="text-gray-700">{order.shipping_name}</p>
            <p className="text-gray-600">{order.shipping_address}</p>
            <p className="text-gray-600">
              {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
            </p>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
              <span>Total pagado:</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">¿Qué sigue?</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Recibirás un email de confirmación en breve</li>
            <li>• Te notificaremos cuando tu pedido sea enviado</li>
            <li>• Puedes seguir el estado de tu pedido en cualquier momento</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Ver mis pedidos
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
