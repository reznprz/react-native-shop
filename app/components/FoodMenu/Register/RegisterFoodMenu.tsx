import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Food } from 'app/api/services/foodService';
import { OrderItem } from 'app/api/services/orderService';
import TopBar from './TopBar';
import RegisterCategoryList from './RegisterCategoryList';
import RegisterFoodList from './RegisterFoodList';
import { TableItem } from 'app/hooks/useTables';

export interface RegisterFoodMenuProps {
  categories: string[];
  foods: Food[];
  selectedSubTab: string;
  tableItems: TableItem;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
}

const TOPBAR_HEIGHT = 60; // Should match the visual height of TopBar

const RegisterFoodMenu: React.FC<RegisterFoodMenuProps> = ({
  categories,
  foods,
  selectedSubTab,
  tableItems,
  updateCartItemForFood,
  onSwitchTableClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFoods = selectedCategory
    ? foods.filter((food) => food.categoryName === selectedCategory)
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Fixed TopBar */}
        <TopBar
          onCategoryClick={() => setSelectedCategory(null)}
          onSwitchTableClick={onSwitchTableClick}
        />
        {/* Content container with a marginTop that prevents overlap */}
        <View style={[styles.content, { marginTop: TOPBAR_HEIGHT }]}>
          {selectedCategory ? (
            <RegisterFoodList
              foods={filteredFoods}
              updateCartItemForFood={updateCartItemForFood}
              selectedSubTab={selectedSubTab}
              tableItems={tableItems}
            />
          ) : (
            <RegisterCategoryList
              categories={categories}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterFoodMenu;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});
