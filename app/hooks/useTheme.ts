import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/rootReducer';
import { defaultTheme, RestaurantTheme } from 'app/theme/theme';
import { useMemo } from 'react';

export const useTheme = (): RestaurantTheme => {
  const { theme: activeTheme } = useSelector((state: RootState) => state.theme);

  return useMemo(
    () => ({
      ...defaultTheme, // ensures any new keys have fallback
      ...(activeTheme || {}), // override with blue/green/brown preset
    }),
    [activeTheme],
  );
};
