import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Food } from 'app/api/services/foodService';
import TopBar from './TopBar';
import RegisterCategoryList from './RegisterCategoryList';
import RegisterFoodList from './RegisterFoodList';
import { TableItem } from 'app/hooks/useTables';
import { RestaurantTable } from 'app/api/services/tableService';
import RegisterTableList from './RegisterTableList';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

type ActiveView = 'categories' | 'food' | 'table';

const TOPBAR_HEIGHT = 60;

export interface RegisterFoodMenuProps {
  categories: string[];
  foods: Food[];
  selectedSubTab: string;
  tableItems: TableItem;
  tables: RestaurantTable[];
  currentTable: string;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
  handleCategoryClick: (categoryName: string) => void;
  onSelectTable: (selectedTable: string) => void;
  refetchTables: () => void;
  refetchFoods: () => void;
}

const RegisterFoodMenu: React.FC<RegisterFoodMenuProps> = ({
  categories,
  foods,
  selectedSubTab,
  tableItems,
  tables,
  currentTable,
  updateCartItemForFood,
  onSwitchTableClick,
  handleCategoryClick,
  onSelectTable,
  refetchTables,
  refetchFoods,
}) => {
  const { numColumnsRegisterScreen, width } = useIsDesktop();

  const [activeView, setActiveView] = useState<ActiveView>('categories');

  const handleCategorySelect = (cat: string) => {
    setActiveView('food');
    handleCategoryClick(cat);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar
          onCategoryClick={() => setActiveView('categories')}
          onSwitchTableClick={() => onSwitchTableClick?.(tableItems.tableName)}
          onTableClick={() => {
            setActiveView('table');
            refetchTables();
          }}
        />
        {/* Adjust content container to account for fixed TopBar */}
        <View style={[styles.content, { marginTop: TOPBAR_HEIGHT }]}>
          {activeView === 'categories' && (
            <RegisterCategoryList
              categories={categories}
              selectedCategory="All"
              onSelectCategory={handleCategorySelect}
              refetchFoods={refetchFoods}
              numColumnsRegisterScreen={numColumnsRegisterScreen}
            />
          )}

          {activeView === 'food' && (
            <RegisterFoodList
              foods={foods}
              updateCartItemForFood={updateCartItemForFood}
              selectedSubTab={selectedSubTab}
              tableItems={tableItems}
              numColumnsRegisterScreen={numColumnsRegisterScreen}
            />
          )}

          {activeView === 'table' && (
            <RegisterTableList
              tables={tables}
              currentTable={currentTable}
              numColumnsRegisterScreen={numColumnsRegisterScreen}
              screenWidth={width}
              onSelectTable={onSelectTable}
              refetchTables={refetchTables}
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
