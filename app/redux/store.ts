import { configureStore } from "@reduxjs/toolkit";
import foodReducer from "./foodSlice";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["filteredFoods"],
};

const persistedFoodReducer = persistReducer(persistConfig, foodReducer);

export const store = configureStore({
  reducer: {
    foods: persistedFoodReducer,
  },
});

export const persistor = persistStore(store);

// Export types for usage throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
