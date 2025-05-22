import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export const useRestaurant = () => {
  const storedAuthData = useSelector((state: RootState) => state.auth.authData);

  return {
    storedAuthData,
  };
};
