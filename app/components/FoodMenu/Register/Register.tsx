import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PaymentDetails from 'app/components/table/PaymentDetails';
import CustomButton from 'app/components/common/button/CustomButton';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { PaymentInfo, TableItem } from 'app/hooks/useTables';
import { OrderItem, OrderMenuType } from 'app/api/services/orderService';
import { ButtonState } from '../../common/button/LoadingButton';
import PrimaryHeader from '../../common/PrimaryHeader';
import { RestaurantTable } from 'app/api/services/tableService';
import RegisterFoodMenu from './RegisterFoodMenu';
import { Food } from 'app/api/services/foodService';
import { PaymentDetailsModal } from 'app/components/modal/PaymentDetailsModal';
import SubTab from 'app/components/common/SubTab';

const subtabs: string[] = Object.values(OrderMenuType);

export type SubTabType = (typeof subtabs)[number];

interface RegisterProps {
  tableItems: TableItem;
  tableNames: string[];
  tables: RestaurantTable[];
  foods: Food[];
  categories: string[];
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
  handleAddDiscount: (discountAmount: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
  handleCompleteOrder: (selectedPayments: PaymentInfo[]) => void;
  handleTableClick: (selectedTableName: string) => void;
  handleSubTabChange: (selectedTab: SubTabType) => void;
  activatedSubTab: SubTabType;
  completeOrderState: ButtonState;
}

export default function Register({
  tableItems,
  tableNames,
  tables,
  foods,
  categories,
  activatedSubTab,
  updateCartItemForFood,
  handleAddDiscount,
  onSwitchTableClick,
  handleCompleteOrder,
  handleTableClick,
  handleSubTabChange,
  completeOrderState,
}: RegisterProps) {
  const { isDesktop } = useIsDesktop();
  const [selectedTable, setSelectedTable] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Callback for handling table filter clicks
  const onFilterClick = useCallback(
    (selectedFilter: string) => {
      setSelectedTable(selectedFilter);
      handleTableClick(selectedFilter);
    },
    [handleTableClick],
  );

  // Callback for opening and closing the Payment Modal
  const openPaymentModal = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  // Extracted header component (used for both mobile & desktop)
  const renderHeader = () => (
    <PrimaryHeader
      title="Tables"
      onBackPress={() => console.log('Go back')}
      onFilterPress={() => console.log('Filter pressed')}
      filters={tableNames}
      isDesktop={isDesktop}
      searchTerm=""
      handleFilterClick={onFilterClick}
      selectedFilter={selectedTable}
      tableInfo={tables}
    />
  );

  // Render function for Desktop layout
  const renderDesktopLayout = () => (
    <View style={styles.desktopContainer}>
      {renderHeader()}
      <View style={styles.desktopContent}>
        {/* Left Panel - Order Summary */}
        <View style={styles.leftPanel}>
          <SubTab
            tabs={subtabs}
            activeTab={activatedSubTab}
            onTabChange={(selectedTab) => {
              handleSubTabChange(selectedTab);
            }}
            tabStyle="py-2"
          />
          <RegisterFoodMenu
            updateCartItemForFood={updateCartItemForFood}
            categories={categories}
            foods={foods}
            selectedSubTab={activatedSubTab}
            tableItems={tableItems}
          />
        </View>

        {/* Right Panel - Payment Details */}
        <ScrollView
          style={styles.rightPanel}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <PaymentDetails
            tableItems={tableItems}
            setDiscount={handleAddDiscount}
            handleCompleteOrder={handleCompleteOrder}
            completeOrderState={completeOrderState}
          />
        </ScrollView>
      </View>
    </View>
  );

  // Render function for Mobile layout
  const renderMobileLayout = () => (
    <>
      {renderHeader()}
      <SubTab
        tabs={subtabs}
        activeTab={activatedSubTab}
        onTabChange={(selectedTab) => {
          handleSubTabChange(selectedTab);
        }}
        tabStyle="py-2"
      />
      <RegisterFoodMenu
        updateCartItemForFood={updateCartItemForFood}
        categories={categories}
        foods={foods}
        selectedSubTab={activatedSubTab}
        tableItems={tableItems}
      />

      {/* Floating Button */}
      <View style={styles.floatingButtonContainer}>
        <CustomButton title="Proceed Payment" onPress={openPaymentModal} />
      </View>
    </>
  );

  return (
    <>
      {isDesktop ? renderDesktopLayout() : renderMobileLayout()}
      <PaymentDetailsModal
        visible={showPaymentModal}
        onClose={closePaymentModal}
        tableItems={tableItems}
        setDiscount={handleAddDiscount}
        handleCompleteOrder={handleCompleteOrder}
        completeOrderState={completeOrderState}
      />
    </>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Equivalent to bg-gray-100
  },
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flexBasis: '65%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginTop: 8,
    marginLeft: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rightPanel: {
    flexBasis: '35%',
    padding: 16,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginRight: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 16, // Adjusted from tailwind "bottom-2"
    alignSelf: 'center', // Center horizontally (similar to left-1/2 and -translate-x-1/2)
    zIndex: 50,
  },
});
