import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from 'app/api/services/authService';

interface AuthState {
  authData: AuthResponse | null;
}

const initialState: AuthState = {
  authData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthResponse>) => {
      state.authData = action.payload;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (state.authData) {
        state.authData.accessToken = action.payload;
      }
    },
    setRestaurantImgUrl: (state, action: PayloadAction<string>) => {
      if (state.authData) {
        state.authData.restaurantImgUrl = action.payload;
      }
    },
    setUserAvatarUrl: (state, action: PayloadAction<string>) => {
      if (state.authData) {
        state.authData.userAvatarUrl = action.payload;
      }
    },
    clearAuthData: (state) => {
      state.authData = null;
    },
  },
});

export const {
  setAuthData,
  updateAccessToken,
  clearAuthData,
  setRestaurantImgUrl,
  setUserAvatarUrl,
} = authSlice.actions;
export default authSlice.reducer;
