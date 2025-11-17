import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CustomButton from 'app/components/common/button/CustomButton';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { PaymentInfo, TableItem } from 'app/hooks/useTables';
import { OrderItem } from 'app/api/services/orderService';
import { ButtonState } from '../../common/button/LoadingButton';
import { RestaurantTable } from 'app/api/services/tableService';
import RegisterFoodMenu from './RegisterFoodMenu';
import { Food } from 'app/api/services/foodService';
import { PaymentDetailsModal } from 'app/components/modal/PaymentDetailsModal';
import RegisterPaymentDetails from './RegisterPaymentDetails';
import { SubTabType } from './RegisterFoodList';
import { useTheme } from 'app/hooks/useTheme';
import FoodPreparationAnimation from 'app/components/common/FoodPreparationAnimation';
import { MutationStatus } from '@tanstack/query-core/build/legacy';

interface RegisterProps {
  tableItems: TableItem;
  tables: RestaurantTable[];
  foods: Food[];
  categories: string[];
  topBreakFast: Food[];
  topLunch: Food[];
  topDrinks: Food[];
  activatedSubTab: SubTabType;
  completeOrderState: ButtonState;
  exstingOrderForTableState: MutationStatus;
  currentTable: string;
  searchTerm: string;
  handleSearch: (text: string) => void;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
  updateCartItemForOrderItem: (item: OrderItem, newQuantity: number) => void;
  handleAddDiscount: (discountAmount: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
  handleCompleteOrder: (selectedPayments: PaymentInfo[]) => void;
  handleSubTabChange: (selectedTab: SubTabType) => void;
  handleCategoryClick: (categoryName: string) => void;
  onSelectTable: (selectedTable: string) => void;
  refetchTables: () => void;
  onAddFoodClick: () => void;
  refetchFoods: () => void;
  handleAddNewTableClick: () => void;
  handleAddNewCategoryClick: () => void;
  handleAddNewFoodClick: () => void;
}

export default function Register({
  tableItems,
  tables,
  foods,
  topBreakFast,
  topDrinks,
  topLunch,
  categories,
  activatedSubTab,
  currentTable,
  searchTerm,
  handleSearch,
  updateCartItemForFood,
  updateCartItemForOrderItem,
  handleAddDiscount,
  onSwitchTableClick,
  handleCompleteOrder,
  onSelectTable,
  onAddFoodClick,
  handleSubTabChange,
  handleCategoryClick,
  refetchTables,
  refetchFoods,
  handleAddNewTableClick,
  handleAddNewCategoryClick,
  handleAddNewFoodClick,
  completeOrderState,
  exstingOrderForTableState,
}: RegisterProps) {
  const theme = useTheme();

  const { isDesktop, isMobile } = useIsDesktop();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Callback for opening and closing the Payment Modal
  const openPaymentModal = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  const renderFoodMenu = () => (
    <RegisterFoodMenu
      isMobile={isMobile}
      updateCartItemForFood={updateCartItemForFood}
      categories={categories}
      foods={foods}
      topBreakFast={topBreakFast}
      topDrinks={topDrinks}
      topLunch={topLunch}
      selectedSubTab={activatedSubTab}
      tableItems={tableItems}
      tables={tables}
      currentTable={currentTable}
      activatedSubTab={activatedSubTab}
      completeOrderState={completeOrderState}
      handleSearch={handleSearch}
      searchTerm={searchTerm}
      onSwitchTableClick={onSwitchTableClick}
      handleCategoryClick={handleCategoryClick}
      onPricingSubTabClick={handleSubTabChange}
      onAddFoodClick={onAddFoodClick}
      onSelectTable={onSelectTable}
      refetchTables={refetchTables}
      refetchFoods={refetchFoods}
      handleAddNewTableClick={handleAddNewTableClick}
      handleAddNewCategoryClick={handleAddNewCategoryClick}
      handleAddNewFoodClick={handleAddNewFoodClick}
      exstingOrderForTableState={exstingOrderForTableState}
    />
  );

  // Render function for Desktop layout
  const renderDesktopLayout = () => (
    <View style={styles.desktopContainer}>
      <View style={styles.desktopContent}>
        {/* Left Panel - Order Summary */}
        <View
          style={[
            styles.leftPanel,
            {
              backgroundColor: theme.secondaryBg,
              borderColor: theme.borderColor,
              shadowColor: theme.textSecondary,
            },
          ]}
        >
          {renderFoodMenu()}
        </View>

        {/* Right Panel - Payment Details */}
        <ScrollView
          style={[
            styles.rightPanel,
            {
              backgroundColor: theme.secondaryBg,
              borderColor: theme.borderColor,
              shadowColor: theme.textSecondary,
            },
          ]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RegisterPaymentDetails
            currentTable={currentTable}
            tableItems={tableItems}
            onApplyDiscount={handleAddDiscount}
            handleCompleteOrder={handleCompleteOrder}
            completeOrderState={completeOrderState}
            updateQuantity={updateCartItemForOrderItem}
          />
        </ScrollView>
      </View>
    </View>
  );

  // Render function for Mobile layout
  const renderMobileLayout = () => (
    <>
      {renderFoodMenu()}

      {tableItems?.id > 0 && (
        <>
          {/* Floating Button */}
          <View style={styles.floatingButtonContainer}>
            <CustomButton title="Proceed Payment" onPress={openPaymentModal} />
          </View>
        </>
      )}
    </>
  );

  return (
    <>
      {isDesktop ? renderDesktopLayout() : renderMobileLayout()}
      <PaymentDetailsModal
        currentTable={currentTable}
        visible={showPaymentModal}
        onClose={closePaymentModal}
        tableItems={tableItems}
        setDiscount={handleAddDiscount}
        handleCompleteOrder={(paymentInfos) => {
          handleCompleteOrder(paymentInfos);
          setShowPaymentModal(false);
        }}
        updateQuantity={updateCartItemForOrderItem}
        completeOrderState={completeOrderState}
      />
    </>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
  },
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flexBasis: '60%',
    padding: 10,
    marginTop: 8,
    marginLeft: 20,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rightPanel: {
    flexBasis: '40%',
    padding: 10,
    marginLeft: 16,
    marginTop: 8,
    marginRight: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
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
