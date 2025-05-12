import React from 'react';
import { View, FlatList } from 'react-native';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import CustomButton from 'app/components/common/button/CustomButton';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import { Category } from 'app/api/services/foodService';
import ListHeader from 'app/components/common/ListHeader';
import SecondaryCategoryCard from './SecondaryCategoryCard';

interface CategoryListSectionProps {
  loading: boolean;
  categories: Category[];
  searchTerm: string;
  isDesktop: boolean;
  isMobile: boolean;
  onDelete: (id: number) => void;
  onUpdate: (selectedCat: Category) => void;
  onSearch: (text: string) => void;
  onAddCategory: () => void;
}

const CategoryListSection: React.FC<CategoryListSectionProps> = ({
  loading,
  categories,
  searchTerm,
  isDesktop,
  isMobile,
  onSearch,
  onDelete,
  onUpdate,
  onAddCategory,
}) => {
  return (
    <>
      {/* Add Expense Button */}
      <View className="flex-row justify-end items-end p-2 pt-4 mb-6">
        <CustomButton
          title={'+ Add Category'}
          onPress={onAddCategory}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {loading ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please refresh or add items to the menu."
          iconSize={100}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isDesktop ? 3 : 2}
          key={isDesktop ? 'h' : 'v'}
          columnWrapperStyle={
            isDesktop ? { paddingHorizontal: 8 } : undefined /* gap between two columns */
          }
          ListHeaderComponent={() => (
            <ListHeader
              title="Category"
              searchTerm={searchTerm}
              searchPlaceholder={'Search categories...'}
              onSearch={onSearch}
            />
          )}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <View className={`${isDesktop ? 'w-1/3' : 'w-1/2'} `}>
              <SecondaryCategoryCard
                category={item}
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

export default CategoryListSection;
