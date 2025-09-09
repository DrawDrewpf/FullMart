import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Hooks tipados para Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector);

// Hook personalizado para mejor tipado
export const useTypedSelector = <T>(selector: (state: RootState) => T) => {
  return useSelector(selector);
};

// Re-export de useSelector tipado para compatibilidad
export { useSelector as useReduxSelector } from 'react-redux';
