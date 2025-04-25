import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilteredFoods } from 'app/redux/foodSlice';
import { RootState, AppDispatch } from 'app/redux/store';
import { usePageState } from './reducers/usePageState';
import { SubCategory } from './utils/groupFoodBySubCategory';
import { useFoodMenuActions } from './apiQuery/useFoodMenuAction';

export const useFood = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tableName = useSelector((state: RootState) => state.table.tableName);
  const storedRestaurantId = useSelector((state: RootState) => state.auth.authData?.restaurantId);
  const foodMenu = useSelector((state: RootState) => state.foodMenu);

  // Local state for search and category
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get food data from Redux store
  const { groupedFoods } = useSelector((state: RootState) => state.foods);

  // Food mutation actions api
  const { loadFoodMenu } = useFoodMenuActions();

  // Function to fetch foods and Categories
  const refetch = useCallback(() => {
    if (storedRestaurantId && storedRestaurantId > 0) {
      loadFoodMenu(storedRestaurantId);
    }
  }, [storedRestaurantId]);

  // Function to filter foods by category
  const filterGroupedFoodsByCategory = useCallback(
    (selectedSubCategory: SubCategory) => {
      if (!foodMenu.foods) {
        return;
      }

      // Normalize strings for comparison
      const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();

      const selectedCategory = normalizeString(selectedSubCategory);

      const filteredFoods = foodMenu.foods.filter((foodItem) => {
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
    },
    [foodMenu.foods, dispatch, usePageState],
  );

  // Function to reset state
  const reset = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory(null);
  }, [dispatch]);

  // Filtered food list based on selected category and search term
  const filteredFoods = useMemo(() => {
    let filtered = foodMenu.foods;

    // Filter by category if one is selected
    if (selectedCategory) {
      const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();

      const selectedCategoryNormalized = normalizeString(selectedCategory);

      filtered = filtered.filter((foodItem) => {
        const categoryNameTwo = normalizeString(foodItem.categoryName || '');
        return categoryNameTwo === selectedCategoryNormalized;
      });
    }

    // Filter by search term if present
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((foodItem) => foodItem.name.toLowerCase().includes(term));
    }

    return filtered;
  }, [foodMenu.foods, selectedCategory, searchTerm]);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'All') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // Search input
  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  return {
    //foods
    foods: filteredFoods,
    allGroupedFoods: groupedFoods,
    refetch,
    reset,
    foodMenu,

    searchTerm,

    // categories
    categories: foodMenu.categories,
    selectedCategory,

    tableName,

    filterGroupedFoodsByCategory,
    handleSearch,
    handleCategoryClick,
  };
};
