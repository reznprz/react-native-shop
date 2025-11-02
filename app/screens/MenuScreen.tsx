import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// hooks
import { useOrder } from 'app/hooks/useOrder';
import { useTables } from 'app/hooks/useTables';
import { useFood } from 'app/hooks/useFood';

// ui components
import SubTab from 'app/components/common/SubTab';
import FoodsMenu, { SubTabType } from 'app/components/FoodMenu/FoodsMenu';
import TableListModal from 'app/components/modal/TableListModal';
import { Food } from 'app/api/services/foodService';
import { OrderMenuType } from 'app/api/services/orderService';
import NotificationBar from 'app/components/common/NotificationBar';
import Register from 'app/components/FoodMenu/Register/Register';

const tabs = ['Register', 'All Foods'];

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
  // route param
  const { selectedTab } = route.params || {};

  // local state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'Register');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(OrderMenuType.NORMAL);
  const [showTableListModal, setShowTableListModal] = useState(false);
  const [successNotification, setSuccessNotificaton] = useState('');

  // external state & actions
  const {
    restaurantFeatures,
    foods,
    foodMenu,
    refetch,
    searchTerm,
    categories,
    handleSearch,
    handleCategoryClick,
    handleAddFoodClick,
    tableName,
  } = useFood();

  const { handleSwitchTable } = useOrder();

  const { topBreakFast, topDrinks, topLunch } = foodMenu;

  const {
    tables,
    currentTable,
    addUpdateOrderError,
    prepTableItems,
    exstingOrderForTableMutation,
    completeOrderState,
    refetchTables,
    refreshPrepTableItems,
    handleAddUpdateFoodItems,
    resetAddOrUpdateOrder,
    handleTableClick,
    handleAddDiscount,
    handleCompleteOrder,
    handleAddNewTableClick,
    handleAddNewCategoryClick,
    handleAddNewFoodClick,
  } = useTables();

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'All Foods') {
        setActiveTab('All Foods');
      } else {
        setActiveTab('Register');
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

  useEffect(() => {
    if (completeOrderState.status === 'success') {
      refreshPrepTableItems(currentTable);
      refetchTables();
      setSuccessNotificaton('Order Completed Successfully!');
      completeOrderState.reset?.();
    }
  }, [completeOrderState]);

  // Check if the Table is Selected
  const onHandleAddUpdateFoodItems = (qty: number, food: Food) => {
    if (!tableName || tableName.trim() === '') {
      setShowTableListModal(true);
      return;
    }
    handleAddUpdateFoodItems(qty, food, undefined, activeSubTab);
  };

  return (
    <View className="h-full w-full bg-gray-100">
      {/* <SubTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(selectedTab) => {
          setActiveTab(selectedTab);

          if (selectedTab === 'All Foods') {
            handleCategoryClick('All');
            setSelectedCategory('All');
          }
        }}
      /> */}

      <View className="flex-1 bg-gray-100">
        {activeTab === 'Register' || activeTab === 'All Foods' ? (
          <Register
            tableItems={prepTableItems}
            activatedSubTab={activeSubTab}
            completeOrderState={completeOrderState}
            tables={tables}
            foods={foods}
            topBreakFast={topBreakFast}
            topLunch={topLunch}
            topDrinks={topDrinks}
            currentTable={currentTable}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            categories={categories?.map((category) => category.name) || ['none']}
            handleSubTabChange={(selectedSubTab) => {
              setActiveSubTab(selectedSubTab);
            }}
            updateCartItemForFood={(food, qty) => {
              onHandleAddUpdateFoodItems(qty, food);
            }}
            updateCartItemForOrderItem={(orderItem, qty) => {
              handleAddUpdateFoodItems(qty, undefined, orderItem, activeSubTab);
            }}
            handleAddDiscount={handleAddDiscount}
            handleCompleteOrder={handleCompleteOrder}
            onSelectTable={handleTableClick}
            onSwitchTableClick={() => {
              setShowTableListModal(true);
            }}
            handleCategoryClick={handleCategoryClick}
            refetchTables={refetchTables}
            refetchFoods={refetch}
            onAddFoodClick={handleAddFoodClick}
            handleAddNewTableClick={handleAddNewTableClick}
            handleAddNewCategoryClick={handleAddNewCategoryClick}
            handleAddNewFoodClick={handleAddNewFoodClick}
          />
        ) : (
          <FoodsMenu
            foods={foods}
            categories={categories}
            tableItems={prepTableItems}
            selectedCategory={selectedCategory}
            activatedSubTab={activeSubTab}
            isFoodsMenuLoading={exstingOrderForTableMutation.isPending}
            handleSubTabChange={(selectedSubTab) => {
              setActiveSubTab(selectedSubTab);
            }}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            handleCategoryClick={handleCategoryClick}
            setSelectedCategory={setSelectedCategory}
            updateCartItemForFood={(food, qty) => {
              onHandleAddUpdateFoodItems(qty, food);
            }}
            refetchFoods={refetch}
          />
        )}
      </View>

      <NotificationBar
        message={addUpdateOrderError?.message || ''}
        variant="error"
        onClose={() => {
          resetAddOrUpdateOrder();
        }}
      />

      {/* Available TableList for Switch table  */}
      <TableListModal
        tables={tables}
        visible={showTableListModal}
        showAvailableIcon={false}
        onClose={() => setShowTableListModal(false)}
        onSelectTable={(selectedTable) => {
          setShowTableListModal(false);
          handleSwitchTable(prepTableItems.id, selectedTable);
        }}
      />

      {/* Success notification */}
      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />
    </View>
  );
}
