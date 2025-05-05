import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodMenuResponse } from 'app/api/services/foodService';

interface FoodMenuState {
  foods: FoodMenuResponse['foods'];
  topBreakFast: FoodMenuResponse['topBreakFast'];
  topLunch: FoodMenuResponse['topLunch'];
  topDrinks: FoodMenuResponse['topDrinks'];
  categories: FoodMenuResponse['categories'];
}

const initialState: FoodMenuState = {
  foods: [],
  topBreakFast: [],
  topLunch: [],
  topDrinks: [],
  categories: [],
};

export const foodMenuSlice = createSlice({
  name: 'foodMenu',
  initialState,
  reducers: {
    setFoodMenu: (state, action: PayloadAction<FoodMenuResponse>) => {
      state.foods = action.payload.foods;
      state.topBreakFast = action.payload.topBreakFast;
      state.topLunch = action.payload.topLunch;
      state.topDrinks = action.payload.topDrinks;
      state.categories = action.payload.categories;
    },
    setFoods: (state, action: PayloadAction<FoodMenuResponse['foods']>) => {
      state.foods = action.payload;
    },
    setCategories: (state, action: PayloadAction<FoodMenuResponse['categories']>) => {
      state.categories = action.payload;
    },
    resetFoodMenu: () => initialState,
  },
});

export const { setFoodMenu, resetFoodMenu, setFoods, setCategories } = foodMenuSlice.actions;

export default foodMenuSlice.reducer;
