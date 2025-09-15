import React from 'react';
import { formatPrice } from '../../utils/currency';
import type { Order } from '../../types';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TruckIcon, 
  XCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <CogIcon className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pedido #{order.order_number}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-2">{getStatusText(order.status)}</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          {order.items?.length || 0} producto(s)
        </p>
        {order.items && order.items.length > 0 && (
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="relative">
                <img
                  src={item.product_image_url || '/placeholder-image.jpg'}
                  alt={item.product_name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shipping Info */}
      <div className="mb-4 text-sm text-gray-600">
        <p>📍 {order.shipping_city}, {order.shipping_state}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {formatPrice(order.total_amount)}
          </p>
          <p className="text-sm text-gray-500">
            Método: {order.payment_method === 'credit_card' ? 'Tarjeta de Crédito' : 
                     order.payment_method === 'debit_card' ? 'Tarjeta de Débito' :
                     order.payment_method === 'paypal' ? 'PayPal' : 'Transferencia'}
          </p>
        </div>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(order)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Ver detalles →
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
