import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import PaymentDetails, { SelectedPayment } from '../table/PaymentDetails';
import { TableItem } from 'app/hooks/useTables';
import { ButtonState } from '../common/button/LoadingButton';

interface PaymentDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  tableItems: TableItem;
  setDiscount: (amount: number) => void;
  handleCompleteOrder: (selectedPayments: SelectedPayment[]) => void;
  completeOrderState: ButtonState;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  visible,
  onClose,
  tableItems,
  setDiscount,
  handleCompleteOrder,
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
          <PaymentDetails
            tableItems={tableItems}
            setDiscount={setDiscount}
            handleCompleteOrder={handleCompleteOrder}
            completeOrderState={completeOrderState}
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
