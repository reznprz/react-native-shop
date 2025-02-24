import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useCart } from 'app/hooks/useCart';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import OrderSummary from 'app/components/table/OrderSummary';
import PaymentDetails from 'app/components/table/PaymentDetails';
import CustomButton from 'app/components/common/button/CustomButton';
import { PaymentDetailsModal } from 'app/components/modal/PaymentDetailsModal';

export default function CartScreen() {
  const { cart, updateCartItemForOrderItem } = useCart();
  const { isDesktop } = useIsDesktop();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <View className="h-full w-full bg-gray-100">
      {isDesktop ? (
        /** 📌 **Desktop Layout (Two Column)** */
        <View className="flex-row h-full">
          {/* Left Panel - Order Summary */}
          <ScrollView
            style={{
              flexBasis: '60%',
              backgroundColor: '#FFFFFF', // White background like the card
              padding: 16,
              marginTop: 8, // Equivalent to mt-2
              marginLeft: 36, // Equivalent to ml-26
              borderRadius: 8, // Optional: Rounded edges
              borderWidth: 2,
              borderColor: '#E5E7EB', // Light Gray Border
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3, // Android shadow
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <OrderSummary cartItems={cart.cartItems} updateQuantity={updateCartItemForOrderItem} />
          </ScrollView>

          {/* Right Panel - Payment Details */}
          <ScrollView
            style={{
              flexBasis: '40%',
              padding: 16,
              marginLeft: 16,
              backgroundColor: '#FFFFFF', // White background like the card
              marginTop: 8, // Equivalent to mt-2
              marginRight: 36, // Equivalent to mr-26
              marginBottom: 16,
              borderRadius: 8, // Rounded Corners
              borderWidth: 1,
              borderColor: '#E5E7EB', // Light Gray Border
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3, // Android shadow
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <PaymentDetails orderItems={cart.cartItems} setDiscount={() => {}} />
          </ScrollView>
        </View>
      ) : (
        /** 📌 **Mobile Layout (Single Column)** */
        <ScrollView
          style={{
            flexBasis: '100%',
            backgroundColor: '#FFFFFF', // White background like the card
            padding: 16,
            borderRadius: 8, // Optional: Rounded edges
            borderWidth: 2,
            borderColor: '#E5E7EB', // Light Gray Border
            margin: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3, // Android shadow
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <OrderSummary cartItems={cart.cartItems} updateQuantity={updateCartItemForOrderItem} />
        </ScrollView>
      )}

      {/* ✅ Floating Button - Only for Mobile */}
      {!isDesktop && (
        <View className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <CustomButton
            title="Proceed Payment"
            onPress={() => {
              setShowPaymentModal(true);
            }}
            width="xl"
          />
        </View>
      )}

      <PaymentDetailsModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderItems={cart.cartItems}
        setDiscount={() => {}}
      />
    </View>
  );
}
