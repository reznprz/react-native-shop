import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// hooks
import { useTables } from 'app/hooks/useTables';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

// ui components
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import SubTab from 'app/components/common/SubTab';
import TableItemAndPayment from 'app/components/table/TableItemAndPayment';
import TableList from 'app/components/table/TableList';
import { PaymentDetailsModal } from 'app/components/modal/PaymentDetailsModal';
import TableListModal from 'app/components/modal/TableListModal';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import { OrderItem } from 'app/api/services/orderService';

const tabs = ['All Tables', 'Table Items'];

type TabType = (typeof tabs)[number];

interface TableScreenRouteParams {
  selectedTab?: TabType;
}

interface TableScreenProps {
  route: {
    params: TableScreenRouteParams;
  };
}

const TableScreen: React.FC<TableScreenProps> = ({ route }) => {
  // local state
  const { selectedTab } = route.params || {};
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'All Tables');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSwitchTableModal, setShowSwitchTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('All');

  // external state & actions
  const {
    currentTable,
    tables,
    availableTables,
    occupiedTables,
    totalCapacity,
    activeOrders,
    tableNames,
    prepTableItems,
    exstingOrderForTableMutation,
    isTablesLoading,
    completeOrderState,
    handleAddUpdateFoodItems,
    handleGoToMenuPress,
    handleTableClick,
    handleAddDiscount,
    refetchTables,
    handleCompleteOrder,
    navigateToOrdersScreen,
  } = useTables();

  const { isDesktop, isLargeScreen, isMobile } = useIsDesktop();

  // effects
  useFocusEffect(
    useCallback(() => {
      refetchTables();
    }, [refetchTables]),
  );

  useFocusEffect(
    useCallback(() => {
      setSelectedTable(currentTable ?? 'All');
    }, [currentTable]),
  );

  useEffect(() => {
    if (completeOrderState.status === 'success') {
      setShowPaymentModal(false);
      navigateToOrdersScreen();
    }
  }, [completeOrderState, navigateToOrdersScreen]);

  const renderTableItems = () => (
    <View className="flex-1">
      <PrimaryHeader
        title="Tables"
        onBackPress={() => console.log('Go back')}
        onFilterPress={() => console.log('Filter pressed')}
        filters={tableNames}
        isDesktop={isDesktop}
        searchTerm=""
        handleFilterClick={(name) => {
          setSelectedTable(name);
          handleTableClick(name);
        }}
        selectedFilter={selectedTable}
        tableInfo={tables}
      />

      {exstingOrderForTableMutation.isPending ? (
        <FoodLoadingSpinner iconName="hamburger" />
      ) : prepTableItems.orderItems.length === 0 && prepTableItems.id === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please add items to the Customer table."
          iconSize={90}
        />
      ) : (
        <TableItemAndPayment
          tableItems={prepTableItems}
          updateQuantity={(item, qty) => handleAddUpdateFoodItems(qty, undefined, item)}
          handleAddDiscount={handleAddDiscount}
          setShowPaymentModal={setShowPaymentModal}
          onSwitchTableClick={() => setShowSwitchTableModal(true)}
          handleCompleteOrder={handleCompleteOrder}
          completeOrderState={completeOrderState}
        />
      )}
    </View>
  );

  const renderTableList = () =>
    isTablesLoading ? (
      <FoodLoadingSpinner iconName="hamburger" />
    ) : (
      <TableList
        tables={tables}
        availableTables={availableTables}
        occupiedTables={occupiedTables}
        totalCapacity={totalCapacity}
        activeOrders={activeOrders}
        isMobile={isMobile}
        isLargeScreen={isLargeScreen}
        onGoToMenu={handleGoToMenuPress}
        onGoToCart={(name) => console.log('Go to cart:', name)}
        onSwitchTable={() => setShowSwitchTableModal(true)}
        fetchTable={refetchTables}
      />
    );

  return (
    <View className="h-full w-full bg-gray-100">
      <SubTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <View className="flex-1 bg-gray-100">
        {activeTab === 'All Tables' ? renderTableList() : renderTableItems()}
      </View>

      <PaymentDetailsModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tableItems={prepTableItems}
        setDiscount={handleAddDiscount}
        handleCompleteOrder={handleCompleteOrder}
        completeOrderState={completeOrderState}
        currentTable={''}
        updateQuantity={() => {}}
      />

      <TableListModal
        tables={tables.filter((t) => t.status.toLowerCase() === 'available')}
        visible={showSwitchTableModal}
        onClose={() => setShowSwitchTableModal(false)}
        onSelectTable={() => setShowSwitchTableModal(false)}
      />

      <ErrorMessagePopUp
        errorMessage={exstingOrderForTableMutation.error?.message ?? ''}
        onClose={() => exstingOrderForTableMutation.reset()}
      />
    </View>
  );
};

export default TableScreen;
