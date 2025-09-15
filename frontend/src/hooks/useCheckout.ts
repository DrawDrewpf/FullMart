import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { clearCartAsync } from '../store/slices/cartSlice';
import { ordersApi } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';
import type { CreateOrderRequest } from '../types';

export interface CheckoutState {
  shippingData: CreateOrderRequest;
  isLoading: boolean;
  error: string | null;
}

const initialShippingData: CreateOrderRequest = {
  shipping_name: '',
  shipping_email: '',
  shipping_phone: '',
  shipping_address: '',
  shipping_city: '',
  shipping_state: '',
  shipping_postal_code: '',
  shipping_country: 'España',
  payment_method: 'credit_card'
};

export const useCheckout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotifications();
  
  const [state, setState] = useState<CheckoutState>({
    shippingData: initialShippingData,
    isLoading: false,
    error: null
  });

  const updateShippingData = useCallback((updates: Partial<CreateOrderRequest>) => {
    setState(prev => ({
      ...prev,
      shippingData: { ...prev.shippingData, ...updates },
      error: null
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const validateForm = useCallback((data: CreateOrderRequest): string | null => {
    if (!data.shipping_name.trim()) return 'El nombre es requerido';
    if (!data.shipping_email.trim()) return 'El email es requerido';
    if (!data.shipping_address.trim()) return 'La dirección es requerida';
    if (!data.shipping_city.trim()) return 'La ciudad es requerida';
    if (!data.shipping_state.trim()) return 'El estado/provincia es requerido';
    if (!data.shipping_postal_code.trim()) return 'El código postal es requerido';
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.shipping_email)) {
      return 'El email no es válido';
    }
    
    return null;
  }, []);

  const submitOrder = useCallback(async (): Promise<boolean> => {
    const validationError = validateForm(state.shippingData);
    if (validationError) {
      setError(validationError);
      addNotification({
        type: 'error',
        title: 'Error de validación',
        message: validationError
      });
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await ordersApi.createOrder(state.shippingData);
      
      // Limpiar carrito
      await dispatch(clearCartAsync()).unwrap();
      
      // Mostrar notificación de éxito
      addNotification({
        type: 'success',
        title: '¡Pedido creado exitosamente!',
        message: `Tu pedido #${response.data.data.order_number} ha sido procesado`
      });
      
      // Redirigir a la página de éxito
      navigate(`/order-success/${response.data.data.id}`);
      
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error.response?.data?.error || 'Error al procesar el pedido';
      
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error al crear el pedido',
        message: errorMessage
      });
      
      console.error('❌ Order creation failed:', error);
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.shippingData, validateForm, setError, addNotification, dispatch, navigate]);

  const resetForm = useCallback(() => {
    setState({
      shippingData: initialShippingData,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    shippingData: state.shippingData,
    isLoading: state.isLoading,
    error: state.error,
    updateShippingData,
    submitOrder,
    resetForm,
    setError
  };
};
