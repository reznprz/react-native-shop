import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import { PaymentInfo, TableItem } from 'app/hooks/useTables';
import { ButtonState } from '../common/button/LoadingButton';
import RegisterPaymentDetails from '../FoodMenu/Register/RegisterPaymentDetails';
import { OrderItem } from 'app/api/services/orderService';

interface PaymentDetailsModalProps {
  visible: boolean;
  currentTable: string;
  onClose: () => void;
  tableItems: TableItem;
  setDiscount: (amount: number) => void;
  handleCompleteOrder: (selectedPayments: PaymentInfo[]) => void;
  updateQuantity: (item: OrderItem, newQuantity: number) => void;

  completeOrderState: ButtonState;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  visible,
  currentTable,
  onClose,
  tableItems,
  setDiscount,
  handleCompleteOrder,
  updateQuantity,
  completeOrderState,
}) => {
  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment</Text>
          <Pressable onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close" size={24} color="#000" />
          </Pressable>
        </View>

        <View style={styles.paymentDetailsContainer}>
          <RegisterPaymentDetails
            currentTable={currentTable}
            tableItems={tableItems}
            onApplyDiscount={setDiscount}
            handleCompleteOrder={handleCompleteOrder}
            completeOrderState={completeOrderState}
            updateQuantity={updateQuantity}
          />
        </View>
      </ScrollView>
    </BaseBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeIcon: {
    padding: 4,
  },
  paymentDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
});
