import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFoods,
  resetState,
  setFilteredFoods,
  setLoading,
  setError,
  clearError,
  clearFilteredFoods,
  fetchCategories,
} from 'app/redux/foodSlice';
import { RootState, AppDispatch } from 'app/redux/store';
import { usePageState } from './reducers/usePageState';
import { SubCategory } from './utils/groupFoodBySubCategory';

export const useFood = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tableName = useSelector((state: RootState) => state.table.tableName);

  // Local state for search and category
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get food data from Redux store
  const {
    foods,
    groupedFoods,
    loading,
    error,
    filterData,
    categories,
    categoriesLoading,
    categoriesError,
  } = useSelector((state: RootState) => state.foods);

  // Function to fetch foods and Categories
  const refetch = useCallback(() => {
    dispatch(fetchFoods());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Function to filter foods by category
  const filterGroupedFoodsByCategory = useCallback(
    (selectedSubCategory: SubCategory) => {
      dispatch(setLoading());

      console.log('selectedSubCategory', selectedSubCategory);
      if (!foods) {
        dispatch(setError('Food list is not available')); // Set error in Redux
        return;
      }

      // Normalize strings for comparison
      const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();

      const selectedCategory = normalizeString(selectedSubCategory);

      const filteredFoods = foods.filter((foodItem) => {
        const categoryNameTwo = normalizeString(foodItem.categoryName || '');
        const isMatch = categoryNameTwo === selectedCategory;

        return isMatch;
      });

      dispatch(
        setFilteredFoods({
          category: selectedSubCategory,
          foods: filteredFoods,
        }),
      );

      dispatch(clearError());
    },
    [foods, dispatch, usePageState],
  );

  // Function to reset state
  const reset = useCallback(() => {
    dispatch(resetState());
    setSearchTerm('');
    setSelectedCategory(null);
  }, [dispatch]);

  // Filtered food list based on selected category and search term
  const filteredFoods = useMemo(() => {
    let filtered = foods;

    // (a) Filter by category if one is selected
    if (selectedCategory) {
      const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();

      const selectedCategoryNormalized = normalizeString(selectedCategory);

      filtered = filtered.filter((foodItem) => {
        const categoryNameTwo = normalizeString(foodItem.categoryName || '');
        return categoryNameTwo === selectedCategoryNormalized;
      });
    }

    // (b) Filter by search term if present
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((foodItem) => foodItem.name.toLowerCase().includes(term));
    }

    return filtered;
  }, [foods, selectedCategory, searchTerm]);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'All') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // 5. Search input
  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  return {
    //foods
    foods: filteredFoods,
    allGroupedFoods: groupedFoods,
    loading,
    error,
    refetch,
    reset,
    filterData,
    clearFilteredFoods,

    searchTerm,

    // categories
    categoriesLoading,
    categoriesError,
    categories,
    selectedCategory,

    tableName,

    filterGroupedFoodsByCategory,
    handleSearch,
    handleCategoryClick,
  };
};
