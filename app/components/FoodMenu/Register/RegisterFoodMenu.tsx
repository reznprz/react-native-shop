import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Food } from 'app/api/services/foodService';
import TopBar from './TopBar';
import RegisterCategoryList from './RegisterCategoryList';
import RegisterFoodList from './RegisterFoodList';
import { TableItem } from 'app/hooks/useTables';
import { RestaurantTable } from 'app/api/services/tableService';
import RegisterTableList from './RegisterTableList';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { SubTabType } from '../FoodsMenu';
import { ButtonState } from 'app/components/common/button/LoadingButton';

type ActiveView = 'categories' | 'food' | 'table';
type ActiveSubFoodView = 'all' | 'breakfast' | 'lunch' | 'drinks';

const TOPBAR_HEIGHT = 60;

export interface RegisterFoodMenuProps {
  isMobile: boolean;
  categories: string[];
  foods: Food[];
  topBreakFast: Food[];
  topLunch: Food[];
  topDrinks: Food[];
  selectedSubTab: string;
  tableItems: TableItem;
  tables: RestaurantTable[];
  currentTable: string;
  searchTerm: string;
  activatedSubTab: SubTabType;
  completeOrderState: ButtonState;
  handleSearch: (text: string) => void;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
  handleCategoryClick: (categoryName: string) => void;
  onSelectTable: (selectedTable: string) => void;
  onPricingSubTabClick: (selectedTab: SubTabType) => void;
  refetchTables: () => void;
  onAddFoodClick: () => void;
  refetchFoods: () => void;
}

const RegisterFoodMenu: React.FC<RegisterFoodMenuProps> = ({
  isMobile,
  categories,
  foods,
  topBreakFast,
  topDrinks,
  topLunch,
  selectedSubTab,
  tableItems,
  tables,
  currentTable,
  searchTerm,
  activatedSubTab,
  completeOrderState,
  handleSearch,
  updateCartItemForFood,
  onSwitchTableClick,
  handleCategoryClick,
  onPricingSubTabClick,
  onSelectTable,
  onAddFoodClick,
  refetchTables,
  refetchFoods,
}) => {
  const { numColumnsRegisterScreen, width } = useIsDesktop();

  const [activeView, setActiveView] = useState<ActiveView>('categories');
  const [activeSubFoodView, setActiveSubFoodView] = useState<ActiveSubFoodView>('all');
  const [activeTopBar, setActiveTopBar] = useState<string>('Table');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (currentTable.trim().length === 0) {
      setActiveView('table');
      setActiveTopBar('Table');
    }
  }, [currentTable]);

  useEffect(() => {
    if (completeOrderState.status === 'success') {
      setActiveView('table');
      setActiveTopBar('Table');
      completeOrderState.reset?.();
    }
  }, [completeOrderState]);

  // Pick which list of foods to render based on the sub-tab
  const displayedFoods =
    activeSubFoodView === 'breakfast'
      ? topBreakFast
      : activeSubFoodView === 'lunch'
        ? topLunch
        : activeSubFoodView === 'drinks'
          ? topDrinks
          : foods;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar
          activeTopBar={activeTopBar}
          onTopBarClick={setActiveTopBar}
          showSwitchTable={tableItems.id > 0}
          onFoodClick={() => {
            if (currentTable.trim().length === 0) {
              setActiveView('table');
              setActiveTopBar('Table');
            } else {
              setActiveView('food');
              setActiveSubFoodView('all');
            }
          }}
          onCategoryClick={() => setActiveView('categories')}
          onSwitchTableClick={() => onSwitchTableClick?.(tableItems.tableName)}
          onTopBreakFastClick={() => {
            if (currentTable.trim().length === 0) {
              setActiveView('table');
              setActiveTopBar('Table');
            } else {
              setActiveSubFoodView('breakfast');
              setActiveView('food');
            }
          }}
          onTopLunchClick={() => {
            if (currentTable.trim().length === 0) {
              setActiveView('table');
              setActiveTopBar('Table');
            } else {
              setActiveSubFoodView('lunch');
              setActiveView('food');
            }
          }}
          onTopDrinkClick={() => {
            if (currentTable.trim().length === 0) {
              setActiveView('table');
              setActiveTopBar('Table');
            } else {
              setActiveSubFoodView('drinks');
              setActiveView('food');
            }
          }}
          onTableClick={() => {
            setActiveView('table');
            refetchTables();
          }}
          onAddFoodClick={onAddFoodClick}
        />
        {/* Adjust content container to account for fixed TopBar */}
        <View style={[styles.content, { marginTop: TOPBAR_HEIGHT }]}>
          {activeView === 'categories' && (
            <RegisterCategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(selectedCat) => {
                handleCategoryClick(selectedCat);
                setActiveView('food');
                setActiveTopBar('Food');
                setSelectedCategory(selectedCat);
              }}
              refetchFoods={refetchFoods}
              numColumnsRegisterScreen={numColumnsRegisterScreen}
            />
          )}

          {activeView === 'food' && (
            <RegisterFoodList
              isMobile={isMobile}
              foods={displayedFoods}
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubTab={selectedSubTab}
              tableItems={tableItems}
              activatedSubTab={activatedSubTab}
              numColumnsRegisterScreen={numColumnsRegisterScreen}
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              updateCartItemForFood={updateCartItemForFood}
              handleCategoryClick={(selectedCat) => {
                handleCategoryClick(selectedCat);
                setSelectedCategory(selectedCat);
              }}
              onPricingSubTabClick={onPricingSubTabClick}
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
