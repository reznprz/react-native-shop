import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import OrderSummary from 'app/components/table/OrderSummary';
import PaymentDetails from 'app/components/table/PaymentDetails';
import CustomButton from 'app/components/common/button/CustomButton';
import { OrderItem } from 'app/redux/cartSlice';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

interface TableItemAndPaymentProps {
  cartItems: OrderItem[];
  updateQuantity: (item: OrderItem, newQty: number) => void;
  showPaymentModal: boolean;
  setShowPaymentModal?: (value: boolean) => void;
  onSwitchTableClick?: (seatName: string) => void;
}

export default function TableItemAndPayment({
  cartItems,
  updateQuantity,
  showPaymentModal,
  setShowPaymentModal,
  onSwitchTableClick,
}: TableItemAndPaymentProps) {
  const { isDesktop } = useIsDesktop();

  return (
    <>
      {isDesktop ? (
        /** 📌 **Desktop Layout (Two Column)** */
        <View className="flex-row flex-grow">
          {/* Left Panel - Order Summary */}
          <ScrollView
            style={styles.leftPanel}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <OrderSummary
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              onSwitchTableClick={onSwitchTableClick}
            />
          </ScrollView>

          {/* Right Panel - Payment Details */}
          <ScrollView
            style={styles.rightPanel}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <PaymentDetails orderItems={cartItems} setDiscount={() => {}} />
          </ScrollView>
        </View>
      ) : (
        /** 📌 **Mobile Layout (Single Column)** */
        <ScrollView
          style={styles.mobilePanel}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <OrderSummary
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            onSwitchTableClick={onSwitchTableClick}
          />
        </ScrollView>
      )}

      {/* ✅ Floating Button - Only for Mobile */}
      {!isDesktop && setShowPaymentModal && (
        <View className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <CustomButton
            title="Proceed Payment"
            onPress={() => {
              setShowPaymentModal(true);
            }}
            width="xl"
            height="l"
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  leftPanel: {
    flexBasis: '60%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    marginLeft: 36,
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
    flexBasis: '40%',
    padding: 16,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginRight: 36,
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
  mobilePanel: {
    flexBasis: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
