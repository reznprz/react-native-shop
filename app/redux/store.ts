import { configureStore } from '@reduxjs/toolkit';
import foodReducer from './foodSlice';
import cartReducer from './cartSlice';
import tableReducer from './tableSlice';
import prepTableItemReducer from './prepTableItemsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['filteredFoods'],
};

const persistedFoodReducer = persistReducer(persistConfig, foodReducer);

export const store = configureStore({
  reducer: {
    foods: persistedFoodReducer,
    cart: cartReducer,
    table: tableReducer,
    prepTableItems: prepTableItemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

// Export types for usage throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
