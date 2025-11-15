import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, FoodMenuResponse } from 'app/api/services/foodService';

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

const addAllCategory = (categories: Category[]): Category[] => {
  const allCategory: Category = {
    id: 0, // Using '0' as a unique ID for "All"
    name: 'All',
    description: '',
    categoryNameTwo: '',
    categoryIcon: 'all-icon', // Use a relevant icon name
  };
  // Prepend the "All" category to the beginning of the array
  return [allCategory, ...categories];
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
      state.categories = addAllCategory(action.payload.categories);
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
