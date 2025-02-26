import React, { useState } from 'react';
import { View } from 'react-native';
import { useTables } from 'app/hooks/useTables';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import PrimaryHeader from 'app/components/common/PrimaryHeader';
import TableItemAndPayment from 'app/components/table/TableItemAndPayment';
import TableList from 'app/components/table/TableList';
import { PaymentDetailsModal } from 'app/components/modal/PaymentDetailsModal';

export default function TableScreen() {
  const {
    tables,
    availableTables,
    occupiedTables,
    totalCapacity,
    activeOrders,
    cart,
    updateCartItemForOrderItem,
    tableNames,
  } = useTables();
  const { isDesktop, isLargeScreen } = useIsDesktop();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('All');

  // Handlers for Actions Menu
  const handleGoToMenu = (tableName: string) => console.log('Go to menu:', tableName);
  const handleGoToCart = (tableName: string) => console.log('Go to cart:', tableName);
  const handleSwitchTable = (tableName: string) => console.log('Switch table:', tableName);

  return (
    <View className="h-full w-full bg-gray-100">
      {/* HEADER */}
      <PrimaryHeader
        title="Tables"
        onBackPress={() => console.log('Go back')}
        onFilterPress={() => console.log('Filter pressed')}
        filters={tableNames}
        isDesktop={isDesktop}
        handleFilterClick={setSelectedTable}
        selectedFilter={selectedTable}
      />

      {/* Wrap the rest of the content in a flex:1 container */}
      <View style={{ flex: 1 }}>
        {selectedTable !== 'All' ? (
          // Order Summary & Payment Section
          <TableItemAndPayment
            cartItems={cart.cartItems}
            updateQuantity={updateCartItemForOrderItem}
            isDesktop={isDesktop}
            showPaymentModal={showPaymentModal}
            setShowPaymentModal={setShowPaymentModal}
          />
        ) : (
          /* Table Metrics & All Table */
          <TableList
            tables={tables}
            availableTables={availableTables}
            occupiedTables={occupiedTables}
            totalCapacity={totalCapacity}
            activeOrders={activeOrders}
            isLargeScreen={isLargeScreen}
            onGoToMenu={handleGoToMenu}
            onGoToCart={handleGoToCart}
            onSwitchTable={handleSwitchTable}
          />
        )}
      </View>

      {/* Payment Modal */}
      <PaymentDetailsModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderItems={cart.cartItems}
        setDiscount={() => {}}
      />
    </View>
  );
}
