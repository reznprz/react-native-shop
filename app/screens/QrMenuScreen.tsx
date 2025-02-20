import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useFoodContext } from "../context/FoodContext";
import SubCategoryContainer from "../components/FoodMenu/SubCategoryContainer";
import { SubCategory } from "app/hooks/useFood";
import ResponsiveList from "../components/common/ResponsiveList";
import { navigate } from "app/navigation/navigationService";
import debounce from "lodash/debounce";
import LoadingSpinner from "app/components/LoadingSpinner";
import ErrorNotification from "app/components/ErrorNotification";
import { ERROR_MESSAGES } from "app/constants/constants";
import { ScreenNames } from "app/types/navigation";

export default function QrMenuScreen() {
  const {
    allGroupedFoods,
    menuState,
    refetch,
    filterGroupeFoodsByCategory,
    resetQrItemScreenState,
    resetState,
  } = useFoodContext();
  const { loading, error } = menuState;

  const { width: screenWidth } = useWindowDimensions();

  // Determine if the view is mobile or desktop
  const isMobile = screenWidth <= 768;

  // Gather subcategory keys
  const subCategoryKeys = allGroupedFoods
    ? (Object.keys(allGroupedFoods) as SubCategory[])
    : [];

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((selectedSubCategory: SubCategory) => {
      filterGroupeFoodsByCategory(selectedSubCategory);
    }, 300),
    [filterGroupeFoodsByCategory]
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleSubCategoryPress = useCallback(
    (selectedSubCategory: SubCategory) => {
      resetQrItemScreenState();

      console.time("Navigation");

      navigate(ScreenNames.QR_MENU_ITEMS, {
        category: selectedSubCategory.toString(),
      });
      console.timeEnd("Navigation");

      debouncedFilter(selectedSubCategory);
    },
    [navigate, filterGroupeFoodsByCategory]
  );

  return (
    <View className="flex-1 bg-white p-6">
      {loading ? (
        // --- Loading State ---
        <View className="flex-1 justify-center items-center bg-white">
          <LoadingSpinner />
        </View>
      ) : error ? (
        // --- Error State ---
        <View className="flex-1 justify-center items-center bg-white px-4">
          <ErrorNotification
            message={error || "An error occurred."}
            onClose={() => {
              resetState();
            }}
          />
        </View>
      ) : subCategoryKeys.length === 0 ? (
        // --- Empty Data ---
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-gray-500">No menu items available.</Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-md"
            onPress={refetch}
          >
            <Text className="m-3 p-2 text-white bg-mocha font-bold text-lg">
              Load Menu
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // --- Success State ---
        <View
          style={{
            width: isMobile ? screenWidth - 32 : 480,
            marginHorizontal: "auto",
          }}
          className="flex-1 bg-white rounded-md py-6 shadow-xl shadow-gray-600 px-6 h-auto"
        >
          <Text className="text-center font-bold pb-6 border-b-[1px] text-primary-font-color text-4xl mb-10 font-mono">
            Sha-jhya
            <Text className="block text-xl font-mono"> Menu </Text>
          </Text>

          {/* Responsive List Container */}
          <ResponsiveList
            data={subCategoryKeys}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={(subCategory, index) => (
              <SubCategoryContainer
                title={subCategory}
                onSubCategoryClick={() => handleSubCategoryPress(subCategory)}
              />
            )}
            ListEmptyComponent={
              <View className="mt-5 justify-center items-center">
                <Text className="text-gray-500">
                  {ERROR_MESSAGES.MENU_DATA_NOT_AVAILABLE}
                </Text>
              </View>
            }
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}
