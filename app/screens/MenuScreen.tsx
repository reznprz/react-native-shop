import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import FoodCard from 'app/components/FoodMenu/FoodCard';
import { useFood } from 'app/hooks/useFood';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { Food } from 'app/api/services/foodService';
import EmptyState from 'app/components/common/EmptyState';
import { useCart } from 'app/hooks/useCart';

export default function MenuScreen() {
  const { isDesktop } = useIsDesktop();
  const { foods, refetch, categories, handleSearch, handleCategoryClick } = useFood();
  const { updateCartItemForFood } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <PrimaryHeader
        title="Categories"
        onBackPress={() => console.log('Go back')}
        onSearch={handleSearch}
        onFilterPress={() => console.log('Filter pressed')}
        filters={categories}
        isDesktop={isDesktop}
        handleFilterClick={(selectedCategory) => {
          handleCategoryClick(selectedCategory);
          setSelectedCategory(selectedCategory);
        }}
        selectedFilter={selectedCategory}
      />

      {!foods || foods.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please check back later or add items to the menu."
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 4 }}>
          <View
            style={{ alignItems: 'stretch' }}
            className="flex-row flex-wrap justify-center px-1"
          >
            {foods?.map((food: Food, idx) => (
              <View
                key={idx}
                className="
              p-1 
              w-1/2     /* 2 columns on mobile (base) */
              sm:w-1/3  /* 3 columns at >=640px */
              md:w-1/4  /* 4 columns at >=768px (iPad) */
              lg:w-1/5  /* 5 columns at >=1024px (desktop) */
            "
              >
                <FoodCard food={food} updateCartItemForFood={updateCartItemForFood} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
