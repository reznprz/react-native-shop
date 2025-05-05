import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import { useFood } from 'app/hooks/useFood';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import CustomButton from 'app/components/common/button/CustomButton';
import { Feather } from '@expo/vector-icons';
import IconLabel from 'app/components/common/IconLabel';
import EmptyState from 'app/components/common/EmptyState';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import SecondaryFoodCard from 'app/components/FoodMenu/foodManager/SecondaryFoodCard';

const FoodManagerScreen: React.FC = () => {
  const {
    foods,

    searchTerm,
    categories,

    // mutatation hooks (api state)
    addFoodMutation,
    updateFoodMutation,
    deleteCategoryMutation,
    addCategoryMutation,
    deleteFoodMutation,

    // handlers
    handleSearch,
    handleCategoryClick,
    refetch,
  } = useFood();

  const { isMobile, isDesktop } = useIsDesktop();

  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <PrimaryHeader
        title="Categories"
        onBackPress={() => console.log('Go back')}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onFilterPress={() => console.log('Filter pressed')}
        filters={categories?.map((category) => category.name) || ['none']}
        isDesktop={isDesktop}
        handleFilterClick={(selectedCategory) => {
          handleCategoryClick(selectedCategory);
          setSelectedCategory(selectedCategory);
        }}
        selectedFilter={selectedCategory}
      />

      {/* Add Expense Button */}
      <View className="flex-row justify-between items-center p-2 pt-4 mb-6">
        <CustomButton
          title={'+ Add Food'}
          onPress={() => {
            {
            }
          }}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
        <CustomButton
          title={'+ Add Category'}
          onPress={() => {
            {
            }
          }}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {addFoodMutation?.status === 'pending' ||
      updateFoodMutation?.status === 'pending' ||
      deleteCategoryMutation?.status === 'pending' ||
      addCategoryMutation?.status === 'pending' ||
      deleteFoodMutation?.status === 'pending' ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !foods || foods.length === 0 ? (
        <EmptyState
          iconName="bank"
          message="No Expenses available"
          subMessage="Please select different Date ."
          iconSize={100}
        />
      ) : (
        <>
          <ScrollView style={{ backgroundColor: '#f9fafb' }}>
            {/* Expenses List */}
            <View className="bg-white rounded-lg shadow-sm">
              {/* Search Bar */}
              <View className="flex-row items-between p-5 justify-between rounded-lg shadow-xl border-b border-gray-200">
                <Text className="text-center text-black font-semibold text-xl mt-2">Foods</Text>
                <View className="flex-row">
                  <View className="flex-row shadow-sm rounded-md border border-gray-200 p-2">
                    <Feather name="search" size={20} color="gray" />
                    <TextInput placeholder="Search foods..." className="ml-2 text-black-700" />
                  </View>
                  <IconLabel
                    iconType={'Fontisto'}
                    iconName={'filter'}
                    iconSize={16}
                    iconColor={'#2A4759'}
                    bgColor={`bg-white`}
                    containerStyle="border border-gray-200 rounded-md ml-2"
                  />
                </View>
              </View>
              {foods.map((food) => (
                <SecondaryFoodCard food={food} isMobile={isMobile} />
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default FoodManagerScreen;
