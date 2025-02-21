import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  LayoutChangeEvent,
  Image,
  useWindowDimensions,
} from "react-native";
import ResponsiveList, {
  ResponsiveListHandle,
} from "app/components/common/ResponsiveList";
import Header from "app/components/FoodMenu/Header";
import CategoryBar from "app/components/FoodMenu/CategoryBar";
import QrFoodList from "app/components/FoodMenu/QrFoodList";
import ErrorNotification from "app/components/ErrorNotification";
import LoadingSpinner from "app/components/LoadingSpinner";
import { ERROR_MESSAGES } from "app/constants/constants";
import { goBack } from "app/navigation/navigationService";
import { useFood } from "app/hooks/useFood";

const shajhyaImage = require("../../assets/shajhya.jpg");

const QrMenuItemsScreen: React.FC = () => {
  const { filterData, clearFilteredFoods } = useFood();

  const { filteredFoods: groupedFoodsByCategory, loading, error } = filterData;

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Ref to our responsive list for imperative scrolling
  const listRef = useRef<ResponsiveListHandle>(null);

  // We'll store category -> y-offset in categoryRefs
  const categoryRefs = useRef<{ [key: string]: number }>({});

  // --- Memos to filter sub-categories and food items ---
  const subCategoryMapMemo = useMemo(
    () => groupedFoodsByCategory || {},
    [groupedFoodsByCategory]
  );
  const subCategoryNames = useMemo(
    () => Object.keys(subCategoryMapMemo),
    [subCategoryMapMemo]
  );

  const [currentSubCategoryIndex, setCurrentSubCategoryIndex] =
    useState<number>(0);
  const selectedSubCategory = subCategoryNames[currentSubCategoryIndex] || "";

  const filteredFoods = useMemo(() => {
    return subCategoryMapMemo[selectedSubCategory] || [];
  }, [subCategoryMapMemo, selectedSubCategory]);

  const categories = useMemo(() => {
    // Unique categoryName within the selected subcategory
    return Array.from(
      new Set(
        filteredFoods
          .map((food) => food.categoryName)
          .filter((category): category is string => category != null)
      )
    );
  }, [filteredFoods]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Auto-dismiss error after 5s
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        clearFilteredFoods();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Scroll to a specific category inside our list
  const handleScrollToCategory = (category: string) => {
    const position = categoryRefs.current[category];
    if (position !== undefined && listRef.current?.scrollToOffset) {
      // Imperative scroll:
      listRef.current.scrollToOffset({ offset: position - 8, animated: true });
      setSelectedCategory(category);
    } else {
      setErrorMessage(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }
  };

  useEffect(() => {
    if (subCategoryNames.length === 0) {
      setErrorMessage(
        `${ERROR_MESSAGES.DATA_NOT_AVAILABLE}: ${selectedCategory}`
      );
    } else if (filteredFoods.length === 0) {
      setErrorMessage(ERROR_MESSAGES.FOOD_DATA_NOT_AVAILABLE);
    } else {
      setErrorMessage("");
    }
  }, [subCategoryNames, filteredFoods]);

  // Capture Y-offset for each category to allow scrolling
  const onCategoryLayout = (category: string, event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    categoryRefs.current[category] = y;
  };

  // Use useWindowDimensions for responsive sizing
  const window = useWindowDimensions();
  const imageHeight = window.height / 4;

  return (
    <View className="flex-1 bg-white">
      {/* Conditionally render based on qrItemScreenState */}
      {loading ? (
        <View className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <LoadingSpinner />
        </View>
      ) : (
        <>
          {/* Header, Image, and CategoryBar are stacked vertically */}
          <View className="bg-white">
            {/* Header Component */}
            <Header subCategoryName={selectedSubCategory} goBack={goBack} />

            {/* Image after Header */}
            <View className="w-full h-auto">
              <Image
                source={shajhyaImage}
                style={{ width: "100%", height: 200 }}
                resizeMode="cover"
                accessibilityLabel="Sha-jhya Restaurant Image"
              />
            </View>

            {/* CategoryBar Component */}
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              scrollToCategory={handleScrollToCategory}
            />
          </View>

          {/* ResponsiveList occupies the remaining space */}
          <ResponsiveList
            ref={listRef} // Important for scrollToOffset
            data={filteredFoods}
            keyExtractor={(food) => food.name}
            renderItem={(food, index) => (
              <QrFoodList
                categories={categories}
                filteredFoods={filteredFoods}
                onCategoryLayout={onCategoryLayout}
                foodItem={food}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Error Notification based on context's error */}
      {error && errorMessage && (
        <ErrorNotification
          message={error || errorMessage || ERROR_MESSAGES.GENERAL_ERROR}
          onClose={() => {
            setErrorMessage("");
            clearFilteredFoods();
          }}
        />
      )}
    </View>
  );
};

export default QrMenuItemsScreen;
