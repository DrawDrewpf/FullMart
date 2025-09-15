import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
  mode: 'view' | 'edit' | 'create';
  onSuccess: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  mode,
  onSuccess
}) => {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    stock_quantity: 0,
    is_active: true
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminApi.getCategories();
        setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Fetch product data when editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId && (mode === 'edit' || mode === 'view')) {
        setLoading(true);
        try {
          const response = await adminApi.getProduct(productId);
          setProduct(response.data.data);
        } catch (err) {
          setError('Error al cargar el producto');
          console.error('Failed to fetch product:', err);
        } finally {
          setLoading(false);
        }
      } else if (mode === 'create') {
        // Reset form for create mode
        setProduct({
          name: '',
          description: '',
          price: 0,
          image_url: '',
          category: '',
          stock_quantity: 0,
          is_active: true
        });
      }
    };

    if (isOpen) {
      fetchProduct();
      setError(null);
    }
  }, [isOpen, productId, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        image_url: product.image_url || '',
        category: product.category || '',
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active ?? true
      };

      if (mode === 'create') {
        await adminApi.createProduct(productData);
      } else if (mode === 'edit' && productId) {
        await adminApi.updateProduct(productId, productData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Nuevo Producto' : 
                mode === 'edit' ? 'Editar Producto' : 
                'Ver Producto';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={saving}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name || ''}
                  onChange={handleInputChange}
                  readOnly={isReadonly}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    isReadonly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={product.description || ''}
                  onChange={handleInputChange}
                  readOnly={isReadonly}
                  required
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    isReadonly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price || ''}
                    onChange={handleInputChange}
                    readOnly={isReadonly}
                    required
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      isReadonly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={product.stock_quantity || ''}
                    onChange={handleInputChange}
                    readOnly={isReadonly}
                    min="0"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      isReadonly ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={product.category || ''}
                  onChange={handleInputChange}
                  disabled={isReadonly}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    isReadonly ? 'bg-gray-50' : ''
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={product.image_url || ''}
                  onChange={handleInputChange}
                  readOnly={isReadonly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    isReadonly ? 'bg-gray-50' : ''
                  }`}
                />
                {product.image_url && (
                  <div className="mt-2">
                    <img
                      src={product.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={product.is_active ?? true}
                  onChange={handleInputChange}
                  disabled={isReadonly}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Producto activo
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isReadonly ? 'Cerrar' : 'Cancelar'}
                </button>
                
                {!isReadonly && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : (mode === 'create' ? 'Crear Producto' : 'Guardar Cambios')}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
