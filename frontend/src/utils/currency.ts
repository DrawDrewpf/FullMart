/**
 * Utilidades para formateo de precios y monedas
 */

export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formatea un precio usando Intl.NumberFormat para máxima profesionalidad
 */
export const formatPrice = (
  price: number | string, 
  options: CurrencyFormatOptions = {}
): string => {
  const {
    locale = 'es-ES',
    currency = 'EUR',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '0,00 €';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numericPrice);
};

/**
 * Formatea precio sin símbolo de moneda (para cálculos)
 */
export const formatPriceNumber = (
  price: number | string,
  options: Omit<CurrencyFormatOptions, 'currency'> = {}
): string => {
  const {
    locale = 'es-ES',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '0,00';
  }

  // Asegurar que minimumFractionDigits no sea mayor que maximumFractionDigits
  const adjustedMinFractionDigits = Math.min(minimumFractionDigits, maximumFractionDigits);

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: adjustedMinFractionDigits,
    maximumFractionDigits
  }).format(numericPrice);
};

/**
 * Formatea totales de carrito con separador de miles
 */
export const formatCartTotal = (total: number | string): string => {
  return formatPrice(total, { minimumFractionDigits: 2 });
};

/**
 * Formatea precios para visualización compacta (sin decimales si es entero)
 */
export const formatCompactPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '0 €';
  }

  // Si es un número entero, no mostrar decimales
  const fractionDigits = numericPrice % 1 === 0 ? 0 : 2;
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2
  }).format(numericPrice);
};
