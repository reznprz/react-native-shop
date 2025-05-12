import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import EmptyState from 'app/components/common/EmptyState';
import FoodCard from 'app/components/FoodMenu/FoodCard';
import { Category, Food } from 'app/api/services/foodService';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import SubTab from '../common/SubTab';
import { TableItem } from 'app/hooks/useTables';
import { OrderMenuType } from 'app/api/services/orderService';
import FoodLoadingSpinner from '../FoodLoadingSpinner';

const subtabs: string[] = Object.values(OrderMenuType);

export type SubTabType = (typeof subtabs)[number];

interface FoodsMenuProps {
  foods: Food[] | null;
  categories: Category[];
  tableItems: TableItem;
  selectedCategory: string;
  activatedSubTab: SubTabType;
  isFoodsMenuLoading: boolean;
  searchTerm: string;
  handleSubTabChange: (selectedTab: SubTabType) => void;
  handleSearch: (text: string) => void;
  handleCategoryClick: (category: string) => void;
  setSelectedCategory: (category: string) => void;
  updateCartItemForFood: (food: Food, quantity: number) => void;
  refetchFoods: () => void;
}

export default function FoodsMenu({
  foods,
  categories,
  tableItems,
  selectedCategory,
  activatedSubTab,
  isFoodsMenuLoading,
  searchTerm,
  handleSubTabChange,
  handleSearch,
  handleCategoryClick,
  setSelectedCategory,
  updateCartItemForFood,
  refetchFoods,
}: FoodsMenuProps) {
  const { width, numColumns, isDesktop } = useIsDesktop();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchFoods();
    setRefreshing(false);
  };

  return (
    <>
      {/* HEADER */}
      <PrimaryHeader
        title="Categories"
        onBackPress={() => console.log('Go back')}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        filters={categories?.map((category) => category.name) || ['none']}
        isDesktop={isDesktop}
        handleFilterClick={(selectedCategory) => {
          handleCategoryClick(selectedCategory);
          setSelectedCategory(selectedCategory);
        }}
        selectedFilter={selectedCategory}
      />

      <SubTab
        tabs={subtabs}
        activeTab={activatedSubTab}
        onTabChange={(selectedTab) => {
          handleSubTabChange(selectedTab);
        }}
        tabStyle="py-2"
      />

      {!foods || foods.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please refresh  or add items to the menu."
        />
      ) : isFoodsMenuLoading ? (
        <FoodLoadingSpinner iconName="hamburger" />
      ) : (
        <FlatList
          key={numColumns}
          data={foods}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={{ paddingVertical: 4, margin: 10 }}
          numColumns={numColumns}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => {
            // Each item should take an equal slice of the row width
            const itemWidth = width / numColumns - 8;

            return (
              <View style={{ width: itemWidth, margin: 3 }}>
                <FoodCard
                  food={item}
                  selectedSubTab={activatedSubTab}
                  tableItem={tableItems.orderItems.find(
                    (tableItem) => tableItem.productName === item.name,
                  )}
                  updateCartItemForFood={updateCartItemForFood}
                />
              </View>
            );
          }}
        />
      )}
    </>
  );
}
