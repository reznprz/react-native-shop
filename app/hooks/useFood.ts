import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import { useFoodMenuActions } from './apiQuery/useFoodMenuAction';
import { Category, Food } from 'app/api/services/foodService';

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
