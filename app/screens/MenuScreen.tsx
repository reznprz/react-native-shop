import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFood } from 'app/hooks/useFood';
import SubTab from 'app/components/common/SubTab';
import { useTables } from 'app/hooks/useTables';
import TableItemAndPayment from 'app/components/table/TableItemAndPayment';
import FoodsMenu, { SubTabType } from 'app/components/FoodMenu/FoodsMenu';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';
import { useFocusEffect } from '@react-navigation/native';
import TableListModal from 'app/components/modal/TableListModal';
import { Food } from 'app/api/services/foodService';
import { OrderMenuType } from 'app/api/services/orderService';

const tabs = ['All Foods', 'Food Items'];

type TabType = (typeof tabs)[number];

interface MenuScreenRouteParams {
  selectedTab?: TabType;
}

interface MenuScreenProps {
  route: {
    params: MenuScreenRouteParams;
  };
}

export default function MenuScreen({ route }: MenuScreenProps) {
  const { selectedTab } = route.params || {};

  const { foods, refetch, categories, handleSearch, handleCategoryClick, tableName } = useFood();

  const {
    tables,
    addUpdateFoodItems,
    resetAddOrUpdateOrder,
    handleSelectTable,
    addUpdateOrderError,
    prepTableItems,
  } = useTables();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'All Foods');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(OrderMenuType.NORMAL);
  const [showTableListModal, setShowTableListModal] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'Food Items') {
        setActiveTab('Food Items');
      } else {
        setActiveTab('All Foods');
      }
    }, [setActiveTab, selectedTab]),
  );

  useEffect(() => {
    if (prepTableItems?.orderMenuType === 'TOURIST') {
      setActiveSubTab(OrderMenuType.TOURIST);
    } else {
      setActiveSubTab(OrderMenuType.NORMAL);
    }
  }, [prepTableItems?.orderMenuType]);

  // Check if the Table is Selected
  const handleAddUpdateFoodItems = (qty: number, food: Food) => {
    // Check if tableName is null, undefined, or empty (after trimming)
    if (!tableName || tableName.trim() === '') {
      setShowTableListModal(true);
      return;
    }
    addUpdateFoodItems(qty, food, undefined, activeSubTab);
  };

  return (
    <View className="h-full w-full bg-gray-100">
      <SubTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(selectedTab) => {
          setActiveTab(selectedTab);

          if (selectedTab === 'All Foods') {
            handleCategoryClick('All');
            setSelectedCategory('All');
          }
        }}
      />

      <View className="flex-1 bg-gray-100">
        {activeTab !== 'All Foods' ? (
          <TableItemAndPayment
            tableItems={prepTableItems}
            updateQuantity={(item, newQty) => {
              addUpdateFoodItems(newQty, undefined, item);
            }}
            handleAddDiscount={() => {}}
            handleCompleteOrder={() => {}}
            completeOrderState={{ status: 'idle' }}
          />
        ) : (
          <FoodsMenu
            foods={foods}
            categories={categories}
            tableItems={prepTableItems}
            selectedCategory={selectedCategory}
            activatedSubTab={activeSubTab}
            handleSubTabChange={(selectedSubTab) => {
              setActiveSubTab(selectedSubTab);
            }}
            handleSearch={handleSearch}
            handleCategoryClick={handleCategoryClick}
            setSelectedCategory={setSelectedCategory}
            updateCartItemForFood={(food, qty) => {
              handleAddUpdateFoodItems(qty, food);
            }}
          />
        )}
      </View>

      <ErrorMessagePopUp
        errorMessage={addUpdateOrderError?.message || ''}
        onClose={() => {
          resetAddOrUpdateOrder();
        }}
      />

      <TableListModal
        tables={tables}
        visible={showTableListModal}
        showAvailableIcon={false}
        onClose={() => setShowTableListModal(false)}
        onSelectTable={(selectedTable) => {
          setShowTableListModal(false);
          handleSelectTable(selectedTable);
        }}
      />
    </View>
  );
}
