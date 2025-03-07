import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFood } from 'app/hooks/useFood';
import SubTab from 'app/components/common/SubTab';
import { useTables } from 'app/hooks/useTables';
import TableItemAndPayment from 'app/components/table/TableItemAndPayment';
import FoodsMenu from 'app/components/FoodMenu/FoodsMenu';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';

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

  const { foods, refetch, categories, handleSearch, handleCategoryClick } = useFood();

  const { addUpdateFoodItems, resetAddOrUpdateOrder, addUpdateOrderError, prepTableItems } =
    useTables();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'All Foods');

  useEffect(() => {
    refetch();
  }, []);

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
          />
        ) : (
          <FoodsMenu
            foods={foods}
            categories={categories}
            tableItems={prepTableItems}
            selectedCategory={selectedCategory}
            handleSearch={handleSearch}
            handleCategoryClick={handleCategoryClick}
            setSelectedCategory={setSelectedCategory}
            updateCartItemForFood={(food, qty) => {
              addUpdateFoodItems(qty, food, undefined);
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
    </View>
  );
}
