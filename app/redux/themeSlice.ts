import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantTheme, ThemeVariant, THEME_PRESETS, defaultTheme } from 'app/theme/theme';

type ThemeState = {
  variant: ThemeVariant;
  theme: RestaurantTheme;
};

const initialState: ThemeState = {
  variant: 'BLUE',
  theme: defaultTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeVariant(state, action: PayloadAction<ThemeVariant>) {
      state.variant = action.payload;
      state.theme = THEME_PRESETS[action.payload];
    },
    // optional if you ever want full custom themes
    setTheme(state, action: PayloadAction<RestaurantTheme>) {
      state.theme = action.payload;
    },
  },
});

export const { setThemeVariant, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
