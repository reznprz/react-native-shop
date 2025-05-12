import React from 'react';
import { View, FlatList } from 'react-native';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import CustomButton from 'app/components/common/button/CustomButton';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import SecondaryFoodCard from 'app/components/FoodMenu/foodManager/SecondaryFoodCard';
import { Category, Food } from 'app/api/services/foodService';
import ListHeader from 'app/components/common/ListHeader';

interface FoodListSectionProps {
  loading: boolean;
  foods: Food[];
  categories: Category[];
  searchTerm: string;
  selectedCategory: string;
  isDesktop: boolean;
  isMobile: boolean;
  onSearch: (text: string) => void;
  onCategoryClick: (categoryName: string) => void;
  onAddFood: () => void;
  onUpdate: (food: Food) => void;
  onDelete: (foodId: number) => void;
}

const FoodListSection: React.FC<FoodListSectionProps> = ({
  loading,
  foods,
  categories,
  searchTerm,
  selectedCategory,
  isDesktop,
  isMobile,
  onSearch,
  onCategoryClick,
  onAddFood,
  onUpdate,
  onDelete,
}) => {
  return (
    <>
      <PrimaryHeader
        title="Categories"
        selectedFilter={selectedCategory}
        searchTerm={searchTerm}
        filters={categories?.map((category) => category.name) || ['none']}
        isDesktop={isDesktop}
        onSearch={onSearch}
        handleFilterClick={(selectedCategory) => {
          onCategoryClick(selectedCategory);
        }}
      />

      {/* Add Expense Button */}
      <View className="flex-row justify-end items-end p-2 pt-4 mb-6">
        <CustomButton
          title={'+ Add Food'}
          onPress={onAddFood}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {loading ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !foods || foods.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please refresh or add items to the menu."
          iconSize={100}
        />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isDesktop ? 2 : 1}
          key={isDesktop ? 'h' : 'v'}
          columnWrapperStyle={
            isDesktop ? { paddingHorizontal: 8 } : undefined /* gap between two columns */
          }
          ListHeaderComponent={() => (
            <ListHeader
              title="Foods"
              searchTerm={searchTerm}
              searchPlaceholder={'Search foods...'}
              onSearch={onSearch}
            />
          )}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <View className={`${isDesktop ? 'w-1/2 p-2' : 'w-full'} `}>
              <SecondaryFoodCard
                food={item}
                isMobile={isMobile}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
};

export default FoodListSection;
