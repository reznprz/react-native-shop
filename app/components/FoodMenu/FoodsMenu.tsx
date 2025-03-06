import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import EmptyState from 'app/components/common/EmptyState';
import FoodCard from 'app/components/FoodMenu/FoodCard';
import { Category, Food } from 'app/api/services/foodService';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import SubTab from '../common/SubTab';
import { TableItem } from 'app/hooks/useTables';

const tabs = ['Normal Menu', 'Tourist Menu'];

type TabType = (typeof tabs)[number];

interface FoodsMenuProps {
  foods: Food[] | null;
  categories: Category[];
  tableItems: TableItem;
  selectedCategory: string;
  handleSearch: (text: string) => void;
  handleCategoryClick: (category: string) => void;
  setSelectedCategory: (category: string) => void;
  updateCartItemForFood: (food: Food, quantity: number) => void;
}

export default function FoodsMenu({
  foods,
  categories,
  tableItems,
  selectedCategory,
  handleSearch,
  handleCategoryClick,
  setSelectedCategory,
  updateCartItemForFood,
}: FoodsMenuProps) {
  const { width, numColumns, isDesktop } = useIsDesktop();
  const [activeTab, setActiveTab] = useState<TabType>('Normal Menu');

  return (
    <>
      {/* HEADER */}
      <PrimaryHeader
        title="Categories"
        onBackPress={() => console.log('Go back')}
        onSearch={handleSearch}
        onFilterPress={() => console.log('Filter pressed')}
        filters={categories.map((category) => category.name)}
        isDesktop={isDesktop}
        handleFilterClick={(selectedCategory) => {
          handleCategoryClick(selectedCategory);
          setSelectedCategory(selectedCategory);
        }}
        selectedFilter={selectedCategory}
      />

      <SubTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(selectedTab) => {
          setActiveTab(selectedTab);
        }}
        tabStyle="py-2"
      />

      {!foods || foods.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please check back later or add items to the menu."
        />
      ) : (
        <FlatList
          key={numColumns}
          data={foods}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={{ paddingVertical: 4, margin: 10 }}
          numColumns={numColumns}
          renderItem={({ item }) => {
            // Each item should take an equal slice of the row width
            const itemWidth = width / numColumns - 8;

            return (
              <View style={{ width: itemWidth, margin: 3 }}>
                <FoodCard
                  food={item}
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
