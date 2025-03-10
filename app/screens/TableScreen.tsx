import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTables } from 'app/hooks/useTables';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import TableItemAndPayment from 'app/components/table/TableItemAndPayment';
import TableList from 'app/components/table/TableList';
import { PaymentDetailsModal } from 'app/components/modal/PaymentDetailsModal';
import TableListModal from 'app/components/modal/TableListModal';
import SubTab from 'app/components/common/SubTab';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from 'app/components/common/EmptyState';

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

export default function TableScreen({ route }: TableScreenProps) {
  const { selectedTab } = route.params || {};

  const {
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
    handleGoToMenuClick,
    handleTableClick,
    handleAddDiscount,
    refetchTables,
    handleCompleteOrder,
    navigateToOrdersScreen,
  } = useTables();

  const { isDesktop, isLargeScreen } = useIsDesktop();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSwitchTableModal, setShowSwitchTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('All');
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'All Tables');

  const handleGoToCart = (tableName: string) => console.log('Go to cart:', tableName);
  const handleSwitchTable = (tableName: string) => console.log('Switch table:', tableName);

  useFocusEffect(
    useCallback(() => {
      refetchTables();
    }, [refetchTables]),
  );

  useEffect(() => {
    if (completeOrderState.status === 'success') {
      setShowPaymentModal(false);
      navigateToOrdersScreen();
    }
  }, [completeOrderState]);

  return (
    <View className="h-full w-full bg-gray-100">
      <SubTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <View className="flex-1 bg-gray-100">
        {activeTab !== 'All Tables' ? (
          <View className="flex-1">
            {/* HEADER */}
            <PrimaryHeader
              title="Tables"
              onBackPress={() => console.log('Go back')}
              onFilterPress={() => console.log('Filter pressed')}
              filters={tableNames}
              isDesktop={isDesktop}
              handleFilterClick={(selectedTable) => {
                setSelectedTable(selectedTable);
                handleTableClick(selectedTable);
              }}
              selectedFilter={selectedTable}
              tableInfo={tables}
            />

            {exstingOrderForTableMutation.isPending ? (
              <FoodLoadingSpinner iconName="hamburger" />
            ) : (
              <>
                {prepTableItems.orderItems.length === 0 && prepTableItems.id === 0 ? (
                  <EmptyState
                    iconName="food-off"
                    message="No food items available"
                    subMessage="Please add items to the Customer table."
                    iconSize={90}
                  />
                ) : (
                  <>
                    <View className="flex-1">
                      {/* Order Summary & Payment Section */}
                      <TableItemAndPayment
                        tableItems={prepTableItems}
                        updateQuantity={(item, newQty) => {
                          handleAddUpdateFoodItems(newQty, undefined, item);
                        }}
                        handleAddDiscount={handleAddDiscount}
                        setShowPaymentModal={setShowPaymentModal}
                        onSwitchTableClick={() => setShowSwitchTableModal(true)}
                        handleCompleteOrder={handleCompleteOrder}
                        completeOrderState={completeOrderState}
                      />
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        ) : (
          <>
            {isTablesLoading ? (
              <FoodLoadingSpinner iconName="hamburger" />
            ) : (
              <TableList
                tables={tables}
                availableTables={availableTables}
                occupiedTables={occupiedTables}
                totalCapacity={totalCapacity}
                activeOrders={activeOrders}
                isLargeScreen={isLargeScreen}
                onGoToMenu={handleGoToMenuClick}
                onGoToCart={handleGoToCart}
                onSwitchTable={() => setShowSwitchTableModal(true)}
              />
            )}
          </>
        )}
      </View>

      {/* Payment Modal */}
      <PaymentDetailsModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tableItems={prepTableItems}
        setDiscount={handleAddDiscount}
        handleCompleteOrder={handleCompleteOrder}
        completeOrderState={completeOrderState}
      />

      <TableListModal
        tables={tables.filter((table) => table.status.toLocaleLowerCase() === 'available')}
        visible={showSwitchTableModal}
        onClose={() => setShowSwitchTableModal(false)}
        onSelectTable={() => {
          setShowSwitchTableModal(false);
        }}
      />

      <ErrorMessagePopUp
        errorMessage={exstingOrderForTableMutation.error?.message || ''}
        onClose={() => {
          exstingOrderForTableMutation.reset();
        }}
      />
    </View>
  );
}
