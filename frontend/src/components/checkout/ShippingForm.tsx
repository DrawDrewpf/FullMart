import React from 'react';
import type { CreateOrderRequest } from '../../types';

interface ShippingFormProps {
  shippingData: CreateOrderRequest;
  onUpdateShippingData: (updates: Partial<CreateOrderRequest>) => void;
  error: string | null;
  isLoading: boolean;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingData,
  onUpdateShippingData,
  error,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdateShippingData({ [name]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de Envío</h2>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre completo */}
        <div className="md:col-span-2">
          <label htmlFor="shipping_name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="shipping_name"
            name="shipping_name"
            value={shippingData.shipping_name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ingresa tu nombre completo"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="shipping_email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="shipping_email"
            name="shipping_email"
            value={shippingData.shipping_email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="tu@email.com"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="shipping_phone" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="shipping_phone"
            name="shipping_phone"
            value={shippingData.shipping_phone || ''}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="+34 123 456 789"
          />
        </div>

        {/* Dirección */}
        <div className="md:col-span-2">
          <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <input
            type="text"
            id="shipping_address"
            name="shipping_address"
            value={shippingData.shipping_address}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Calle, número, piso, puerta..."
          />
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad *
          </label>
          <input
            type="text"
            id="shipping_city"
            name="shipping_city"
            value={shippingData.shipping_city}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Madrid"
          />
        </div>

        {/* Estado/Provincia */}
        <div>
          <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-2">
            Provincia *
          </label>
          <input
            type="text"
            id="shipping_state"
            name="shipping_state"
            value={shippingData.shipping_state}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Madrid"
          />
        </div>

        {/* Código Postal */}
        <div>
          <label htmlFor="shipping_postal_code" className="block text-sm font-medium text-gray-700 mb-2">
            Código Postal *
          </label>
          <input
            type="text"
            id="shipping_postal_code"
            name="shipping_postal_code"
            value={shippingData.shipping_postal_code}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="28001"
          />
        </div>

        {/* País */}
        <div>
          <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-2">
            País *
          </label>
          <select
            id="shipping_country"
            name="shipping_country"
            value={shippingData.shipping_country}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="España">España</option>
            <option value="Francia">Francia</option>
            <option value="Portugal">Portugal</option>
            <option value="Italia">Italia</option>
            <option value="Alemania">Alemania</option>
          </select>
        </div>
      </div>

      {/* Método de Pago */}
      <div className="mt-6">
        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
          Método de Pago *
        </label>
        <select
          id="payment_method"
          name="payment_method"
          value={shippingData.payment_method}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="debit_card">Tarjeta de Débito</option>
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">Transferencia Bancaria</option>
        </select>
      </div>
    </div>
  );
};

export default ShippingForm;
