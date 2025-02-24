import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import CategoryChip from '../common/CategoryChip';
import { OrderItem } from 'app/redux/cartSlice';
import PaymentDetails from '../table/PaymentDetails';

interface PaymentDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  setDiscount: (amount: number) => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  visible,
  onClose,
  orderItems,
  setDiscount,
}) => {
  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Pressable onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.categoriesContainer}>
          <PaymentDetails orderItems={orderItems} setDiscount={setDiscount} />
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
