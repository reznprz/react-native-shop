import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "app/api/handlers";
import {
  fetchAllFoods,
  Food,
  GetAllFoodsResponse,
} from "app/api/services/foodService";
import {
  groupFoodBySubCategory,
  SubCategory,
} from "app/hooks/utils/groupFoodBySubCategory";

// Define the slice state interface
interface FoodState {
  foods: Food[];
  categories: string[];
  groupedFoods: Record<SubCategory, Food[]>;
  filterData: {
    filteredFoods: Record<string, Food[]>;
    loading: boolean;
    error: string | null;
  };
  loading: boolean;
  error: string | null;
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
};

// Async thunk to fetch foods
export const fetchFoods = createAsyncThunk<
  Food[],
  void,
  { rejectValue: string }
>("foods/fetchFoods", async (_, { rejectWithValue }) => {
  try {
    const response: ApiResponse<GetAllFoodsResponse> = await fetchAllFoods();
    if (response.status === "success") {
      return response.data?.payload || [];
    } else {
      return rejectWithValue(response.message);
    }
  } catch (error) {
    return rejectWithValue("An unexpected error occurred");
  }
});

const foodSlice = createSlice({
  name: "foods",
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
    },
    setFilteredFoods(
      state,
      action: PayloadAction<{ category: SubCategory; foods: Food[] }>
    ) {
      state.filterData.filteredFoods[action.payload.category] =
        action.payload.foods;
    },
    clearFilteredFoods(state) {
      state.filterData.filteredFoods = {} as Record<string, Food[]>;
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
    builder.addCase(fetchFoods.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchFoods.fulfilled,
      (state, action: PayloadAction<Food[]>) => {
        state.loading = false;
        state.foods = action.payload;
        state.groupedFoods = groupFoodBySubCategory(action.payload);
        const categories = [
          ...new Set(
            action.payload
              .map((food) => food.categoryName)
              .filter((category): category is string => category !== null)
          ),
        ];
        state.categories = categories;
      }
    );
    builder.addCase(fetchFoods.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
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
