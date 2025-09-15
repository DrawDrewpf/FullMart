import React from 'react';
import { formatPrice } from '../../utils/currency';
import type { CartItem } from '../../types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  loading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal, loading = false }) => {
  const taxRate = 0.21; // 21% IVA
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 50 ? 0 : 5.99; // Free shipping over €50
  const total = subtotal + taxAmount + shippingAmount;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md border border-gray-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </p>
              <p className="text-sm text-gray-500">
                Cantidad: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 pt-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>IVA (21%)</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Envío</span>
          <span>
            {subtotal > 50 ? (
              <span className="text-green-600 font-medium">Gratis</span>
            ) : (
              formatPrice(shippingAmount)
            )}
          </span>
        </div>

        {/* Free shipping message */}
        {subtotal <= 50 && (
          <div className="text-xs text-orange-600 mb-4 p-2 bg-orange-50 rounded-md">
            💡 ¡Añade {formatPrice(50 - subtotal)} más para envío gratis!
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="mt-6 p-3 bg-green-50 rounded-md">
        <div className="flex items-center text-sm text-green-800">
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1L5 6v3.998h10V6l-5-5zM8 19v-6h4v6H8z" clipRule="evenodd" />
          </svg>
          <span>Pago seguro con cifrado SSL</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
