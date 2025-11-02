import React, { useState } from 'react';
import { View } from 'react-native';
import { useFood } from 'app/hooks/useFood';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

import FoodListSection from 'app/components/FoodMenu/foodManager/FoodListSection';
import AddUpdateFoodForm from 'app/components/FoodMenu/foodManager/AddUpdateFoodForm';
import { AddUpdateCategoryForm } from 'app/components/FoodMenu/foodManager/AddUpdateCategoryForm';
import SubTab from 'app/components/common/SubTab';
import CategoryListSection from 'app/components/FoodMenu/foodManager/CategoryListSection';
import ConfirmationModal from 'app/components/modal/ConfirmationModal';
import { Category, Food } from 'app/api/services/foodService';

const tabs = ['Food', 'Category'];

type TabType = (typeof tabs)[number];

interface FoodManagerScreenRouteParams {
  selectedTab?: TabType;
}

interface FoodManagerScreenProps {
  route: {
    params: FoodManagerScreenRouteParams;
  };
}

export default function FoodManagerScreen({ route }: FoodManagerScreenProps) {
  const {
    foods,

    searchTerm,
    categories,

    // mutatation hooks (api state)
    addFoodMutation,
    updateFoodMutation,
    deleteCategoryMutation,
    addCategoryMutation,
    updateCategoryMutation,
    deleteFoodMutation,

    // handlers
    handleSearch,
    handleCategoryClick,
    handleAddFood,
    handleUpdateFood,
    handleAddCategory,
    handleDeleteFood,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useFood();

  const { isMobile, isDesktop } = useIsDesktop();
  const { selectedTab } = route.params || {};

  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'Food');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mode, setMode] = useState<'' | 'addFood' | 'addUpdateCategory'>('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<number | null>(
    null,
  );
  const [updateCategory, setUpdateCategory] = useState<Category | null>(null);
  const [updateFood, setUpdateFood] = useState<Food | null>(null);

  const loading =
    addFoodMutation?.status === 'pending' ||
    updateFoodMutation?.status === 'pending' ||
    deleteCategoryMutation?.status === 'pending' ||
    addCategoryMutation?.status === 'pending' ||
    updateCategoryMutation?.status === 'pending' ||
    deleteFoodMutation?.status === 'pending';

  if (mode === 'addFood' && activeTab === 'Food') {
    return (
      <AddUpdateFoodForm
        food={updateFood}
        categories={categories}
        onSubmit={(food, catId, filePart) => {
          if (updateFood) {
            const updatedFood = food as Food;
            handleUpdateFood(updateFood.id, updatedFood, filePart);
          } else {
            handleAddFood(catId, food as Food, filePart);
          }
          setActiveTab('Food');
          setMode('');
          setUpdateFood(null);
        }}
        onAddNewCategoryClick={() => {
          setActiveTab('Category');
          setMode('');
        }}
        onCancel={() => {
          setMode('');
          setUpdateFood(null);
        }}
      />
    );
  }

  if (mode === 'addUpdateCategory' && activeTab === 'Category') {
    return (
      <AddUpdateCategoryForm
        category={updateCategory}
        onSubmit={(category) => {
          if (updateCategory) {
            handleUpdateCategory(category);
          } else {
            handleAddCategory(category);
          }
          setMode('');
          setUpdateCategory(null);
        }}
        onCancel={() => {
          setMode('');
          setUpdateCategory(null);
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <SubTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(selectedTab) => {
          setActiveTab(selectedTab);

          if (selectedTab === 'All Foods') {
            handleCategoryClick('All');
            setSelectedCategory('All');
          }
        }}
      />

      {activeTab === 'Category' ? (
        <CategoryListSection
          loading={loading}
          categories={categories}
          searchTerm={''}
          isDesktop={false}
          isMobile={false}
          onSearch={() => {}}
          onAddCategory={() => setMode('addUpdateCategory')}
          onDelete={(id) => setShowDeleteConfirmationModal(id)}
          onUpdate={(selectedCat) => {
            setUpdateCategory(selectedCat);
            setMode('addUpdateCategory');
          }}
        />
      ) : (
        <FoodListSection
          loading={loading}
          foods={foods}
          categories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          isDesktop={isDesktop}
          isMobile={isMobile}
          onSearch={handleSearch}
          onCategoryClick={(selectedCat) => {
            handleCategoryClick(selectedCat);
            setSelectedCategory(selectedCat);
          }}
          onAddFood={() => setMode('addFood')}
          onDelete={(id) => setShowDeleteConfirmationModal(id)}
          onUpdate={(selectedFood) => {
            setUpdateFood(selectedFood);
            setMode('addFood');
          }}
        />
      )}
      <ConfirmationModal
        visible={showDeleteConfirmationModal !== null}
        onRequestClose={() => setShowDeleteConfirmationModal(null)}
        onConfirm={() => {
          // showDeleteConfirmationModal carry the id
          if (showDeleteConfirmationModal) {
            if (activeTab === 'Food') {
              handleDeleteFood(showDeleteConfirmationModal);
            } else if (activeTab === 'Category') {
              handleDeleteCategory(showDeleteConfirmationModal);
            }
          }
          setShowDeleteConfirmationModal(null);
        }}
        confirmationText="Are you sure you want to delete this item? This action cannot be undone."
      />
    </View>
  );
}
