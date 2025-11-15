import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Internal Components & Types
import RegisterFoodCard from './RegisterFoodCard';
import RegisterCategoryBar from './RegisterCategoryBar';
import MobileSidebar from 'app/components/common/MobileSidebar';
import SearchBar from 'app/components/common/SearchBar';
import { Food } from 'app/api/services/foodService';
import { TableItem } from 'app/hooks/useTables';
import SubTab from 'app/components/common/SubTab';
import { OrderMenuType } from 'app/redux/prepTableItemsSlice';
import EmptyState from 'app/components/common/EmptyState';

const subtabs: string[] = Object.values(OrderMenuType);

export type SubTabType = (typeof subtabs)[number];

interface Props {
  isMobile: boolean;
  foods: Food[];
  categories: string[];
  selectedCategory: string;
  selectedSubTab: string;
  tableItems: TableItem;
  numColumnsRegisterScreen: number;
  searchTerm: string;
  activatedSubTab: SubTabType;
  handleSearch: (text: string) => void;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
  handleCategoryClick: (categoryName: string) => void;
  onPricingSubTabClick: (selectedTab: SubTabType) => void;
  handleAddNewFoodClick: () => void;
}

const RegisterFoodList: React.FC<Props> = ({
  isMobile,
  foods,
  categories,
  selectedCategory,
  selectedSubTab,
  tableItems,
  numColumnsRegisterScreen,
  searchTerm,
  activatedSubTab,
  handleSearch,
  updateCartItemForFood,
  handleCategoryClick,
  onPricingSubTabClick,
  handleAddNewFoodClick,
}) => {
  // State for mobile sidebar visibility and search text
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // Animated value for sidebar slide-in/out
  const slideAnim = useState(new Animated.Value(-220))[0];

  // Toggle sidebar animation for mobile view
  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Slide sidebar out and then hide it
      Animated.timing(slideAnim, {
        toValue: -220,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setSidebarVisible(false));
    } else {
      // Show sidebar and then slide it in
      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  if (!foods || foods.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <EmptyState
          iconName="food-off"
          message="No foods available"
          subMessage="Please add new food to start taking orders."
          iconSize={90}
          onAddPress={() => handleAddNewFoodClick()}
          addButtonLabel="Add New Table"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SubTab
        tabs={subtabs}
        activeTab={activatedSubTab}
        onTabChange={(selectedTab) => {
          onPricingSubTabClick(selectedTab);
        }}
        tabStyle="py-2"
      />
      {/* Mobile Top Bar with Category Toggle and Search */}
      {isMobile && (
        <View style={styles.topBar}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.categoryToggleButton}>
            <Ionicons name="grid-outline" size={18} color="#333" style={{ marginRight: 6 }} />
            <Text style={styles.categoryToggleText}>Categories</Text>
            <Ionicons name="chevron-forward" size={18} color="#333" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <SearchBar isDesktop={!isMobile} searchTerm={searchTerm} onSearch={handleSearch} />
        </View>
      )}

      {/*  Main Content Layout */}
      <View style={styles.mainContent}>
        {/* Tablet/Desktop Sidebar */}
        {!isMobile && (
          <View style={styles.sidebar}>
            <RegisterCategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </View>
        )}

        {/* Content Area containing the search bar (for tablet/desktop) and food list */}
        <View style={styles.contentArea}>
          {!isMobile && (
            <View style={styles.tabletSearchWrapper}>
              <SearchBar isDesktop={!isMobile} searchTerm={searchTerm} onSearch={handleSearch} />
            </View>
          )}

          <FlatList
            data={foods}
            numColumns={numColumnsRegisterScreen}
            // Re-run layout when numColumns changes
            key={numColumnsRegisterScreen}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RegisterFoodCard
                food={item}
                tableItem={tableItems.orderItems.find(
                  (tableItem) => tableItem.productName === item.name,
                )}
                selectedSubTab={selectedSubTab}
                updateCartItemForFood={updateCartItemForFood}
                numColumnsRegisterScreen={numColumnsRegisterScreen}
              />
            )}
          />
        </View>
      </View>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar
        slideAnim={slideAnim}
        visible={sidebarVisible}
        categories={categories}
        selectedCategory={selectedCategory}
        onClose={toggleSidebar}
        handleCategoryClick={handleCategoryClick}
      />
    </View>
  );
};

export default RegisterFoodList;

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  // Mobile Top Bar styles
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#fefefe',
  },
  categoryToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1e8f5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginRight: 8,
  },
  categoryToggleText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  // Layout styles for main content
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 180,
    borderRightWidth: 0.5,
    borderColor: '#ccc',
    elevation: 2,
  },
  contentArea: {
    flex: 1,
  },
  tabletSearchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  // List and column styles
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
