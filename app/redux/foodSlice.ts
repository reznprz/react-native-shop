import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse } from 'app/api/handlers';
import { Category, fetchAllCategories, fetchAllFoods, Food } from 'app/api/services/foodService';
import { groupFoodBySubCategory, SubCategory } from 'app/hooks/utils/groupFoodBySubCategory';

// Define the slice state interface
interface FoodState {
  foods: Food[];
  categories: Category[];
  groupedFoods: Record<SubCategory, Food[]>;
  filterData: {
    filteredFoods: Record<string, Food[]>;
    loading: boolean;
    error: string | null;
  };
  loading: boolean;
  error: string | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
}

const initialState: FoodState = {
  foods: [],
  categories: [],
  groupedFoods: {} as Record<SubCategory, Food[]>,
  filterData: {
    filteredFoods: {},
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
  categoriesLoading: false,
  categoriesError: null,
};

// Async thunk to fetch foods
export const fetchFoods = createAsyncThunk<Food[], number, { rejectValue: string }>(
  'foods/fetchFoods',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Food[]> = await fetchAllFoods(restaurantId);
      if (response.status === 'success') {
        return response.data || [];
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk<Category[], number, { rejectValue: string }>(
  'foods/fetchCategories',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Category[]> = await fetchAllCategories(restaurantId);
      if (response.status === 'success') {
        return response.data || [];
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

const foodSlice = createSlice({
  name: 'foods',
  initialState,
  reducers: {
    resetState(state) {
      state.foods = [];
      state.categories = [];
      state.groupedFoods = {} as Record<SubCategory, Food[]>;
      state.filterData = {
        filteredFoods: {},
        loading: false,
        error: null,
      };
      state.loading = false;
      state.error = null;
      state.categoriesLoading = false;
      state.categoriesError = null;
    },
    setFilteredFoods(state, action: PayloadAction<{ category: SubCategory; foods: Food[] }>) {
      state.filterData.filteredFoods[action.payload.category] = action.payload.foods;
    },
    clearFilteredFoods(state) {
      state.filterData.filteredFoods = {};
    },
    setLoading(state) {
      state.filterData.loading = true;
      state.filterData.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.filterData.loading = false;
      state.filterData.error = action.payload;
    },
    clearError(state) {
      state.filterData.error = null;
      state.filterData.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchFoods thunk
    builder.addCase(fetchFoods.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFoods.fulfilled, (state, action: PayloadAction<Food[]>) => {
      state.loading = false;
      state.foods = action.payload;
    });
    builder.addCase(fetchFoods.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Handle fetchCategories thunk
    builder.addCase(fetchCategories.pending, (state) => {
      state.categoriesLoading = true;
      state.categoriesError = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
      state.categoriesLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    });
  },
});

export const {
  resetState,
  setFilteredFoods,
  clearFilteredFoods,
  setLoading,
  setError,
  clearError,
} = foodSlice.actions;

export default foodSlice.reducer;
