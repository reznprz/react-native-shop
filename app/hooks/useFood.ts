import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import { useFoodMenuActions } from './apiQuery/useFoodMenuAction';
import { Category, Food } from 'app/api/services/foodService';
import { push } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';

export const useFood = () => {
  const tableName = useSelector((state: RootState) => state.table.tableName);
  const storedAuthData = useSelector((state: RootState) => state.auth.authData);
  const foodMenu = useSelector((state: RootState) => state.foodMenu);

  // Local state for search and category
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    restaurantId: storedRestaurantId = 0,
    features: restaurantFeatures = [],
    accessLevel,
  } = storedAuthData || {};

  // Food mutation actions api
  const {
    loadFoodMenu,
    addFoodMutation,
    updateFoodMutation,
    deleteFoodMutation,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useFoodMenuActions();

  // Function to fetch foods and Categories
  const refetch = useCallback(() => {
    if (storedRestaurantId && storedRestaurantId > 0) {
      loadFoodMenu(storedRestaurantId);
    }
  }, [storedRestaurantId]);

  // Filtered food list based on selected category and search term
  const filteredFoods = useMemo(() => {
    const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();

    const originalFoods = foodMenu.foods;

    // If there is a search term, search from the full list (ignore category)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return originalFoods.filter((foodItem) => foodItem.name.toLowerCase().includes(term));
    }

    // If no search, filter by selected category (if any)
    if (selectedCategory) {
      const selectedCategoryNormalized = normalizeString(selectedCategory);

      return originalFoods.filter((foodItem) => {
        const categoryNameNormalized = normalizeString(foodItem.categoryName || '');
        return categoryNameNormalized === selectedCategoryNormalized;
      });
    }

    // Default: return all foods
    return originalFoods;
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

  const handleAddFood = useCallback(
    (categoryId: number, newFood: Food, filePart?: any) => {
      addFoodMutation.mutate({
        restaurantId: storedRestaurantId || 0,
        categoryId: categoryId,
        newFood: newFood,
        file: filePart,
      });
    },
    [addFoodMutation, storedRestaurantId],
  );

  const handleUpdateFood = useCallback(
    (foodId: number, updatedFood: Food, filePart?: any) => {
      updateFoodMutation.mutate({
        foodId: foodId,
        updatedFood: updatedFood,
        file: filePart,
      });
    },
    [updateFoodMutation],
  );

  const handleDeleteFood = useCallback(
    (foodId: number) => {
      deleteFoodMutation.mutate({
        foodId: foodId,
      });
    },
    [deleteFoodMutation],
  );

  const handleAddCategory = useCallback(
    (newCategory: Category) => {
      addCategoryMutation.mutate({
        restaurantId: storedRestaurantId || 0,
        newCategory: newCategory,
      });
    },
    [addCategoryMutation, storedRestaurantId],
  );

  const handleUpdateCategory = useCallback(
    (updatedCategory: Category) => {
      updateCategoryMutation.mutate({
        updatedCategory: updatedCategory,
      });
    },
    [updateCategoryMutation],
  );

  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      deleteCategoryMutation.mutate({
        restaurantId: storedRestaurantId || 0,
        categoryId: categoryId,
      });
    },
    [deleteCategoryMutation],
  );

  const handleAddFoodClick = useCallback(() => {
    push(ScreenNames.FOODMANAGER);
  }, [push]);

  return {
    //config
    restaurantFeatures,
    accessLevel,

    //foods
    foods: filteredFoods,
    refetch,
    foodMenu,

    searchTerm,

    // categories
    categories: foodMenu.categories,
    selectedCategory,

    tableName,
    handleSearch,
    handleCategoryClick,

    //food manager
    handleAddFood,
    handleDeleteFood,
    handleUpdateFood,
    handleAddCategory,
    handleAddFoodClick,
    handleUpdateCategory,
    handleDeleteCategory,

    //mutations
    addFoodMutation,
    updateFoodMutation,
    deleteFoodMutation,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};
