import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { PaymentInfo, TableItem } from 'app/hooks/useTables';
import { PAYMENT_WARN_MESSAGES } from 'app/constants/constants';
import { OrderItem } from 'app/api/services/orderService';
import LoadingButton, { ButtonState } from 'app/components/common/button/LoadingButton';
import IconLabel from 'app/components/common/IconLabel';
import PaymentMethodsSelector from 'app/components/PaymentMethodsSelector';
import NotificationBar from 'app/components/common/NotificationBar';
import NotificationWithButtons from 'app/components/NotificationWithButtons';
import RegisterOrderItemsSummary from './RegisterOrderItemsSummary';
import CollapsibleInfo from 'app/components/common/CollapsibleInfo';
import BillingSummaryCard from 'app/components/table/BillingSummaryCard';

interface RegisterPaymentDetailsProps {
  tableItems: TableItem;
  currentTable: string;
  onApplyDiscount: (amount: number) => void;
  handleCompleteOrder: (selectedPayments: PaymentInfo[]) => void;
  updateQuantity: (item: OrderItem, newQuantity: number) => void;
  completeOrderState: ButtonState;
}

const RegisterPaymentDetails: React.FC<RegisterPaymentDetailsProps> = ({
  tableItems,
  currentTable,
  onApplyDiscount,
  handleCompleteOrder,
  updateQuantity,
  completeOrderState,
}) => {
  const items = tableItems?.orderItems || [];
  const [selectedPayments, setSelectedPayments] = useState<PaymentInfo[]>([]);
  const [paymentWarnMessage, setPaymentWarnMessage] = useState('');
  const [paymentConfirmationMessage, setPaymentConfirmationMessage] = useState('');
  const [discount, setDiscount] = useState('');

  const applyDiscount = useCallback(
    (amount: number) => {
      if (amount > 0 && selectedPayments.length > 1) {
        setSelectedPayments([]);
        setPaymentWarnMessage(PAYMENT_WARN_MESSAGES.REST_PAYMENTS);
      }
      onApplyDiscount(amount);
      setDiscount(amount.toString());
    },
    [selectedPayments],
  );

  const onCompletePress = useCallback(() => {
    const totalPaymentsAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
    if (selectedPayments.length > 1) {
      if (totalPaymentsAmount > tableItems.totalPrice) {
        setPaymentWarnMessage(
          `${PAYMENT_WARN_MESSAGES.PAYMENTS_TOTAL_INCORRECT} : TotalPaymentAmount: ${totalPaymentsAmount}`,
        );
        return;
      }
      if (totalPaymentsAmount < tableItems.totalPrice) {
        setPaymentConfirmationMessage(
          `${PAYMENT_WARN_MESSAGES.PAYMENTS_CONFORMATION} : TotalPaymentAmount: ${totalPaymentsAmount}`,
        );
        return;
      }
    }
    handleCompleteOrder(selectedPayments);
    setPaymentWarnMessage('');
  }, [selectedPayments, tableItems.totalPrice, handleCompleteOrder]);

  const reset = () => {
    setDiscount('');
    setSelectedPayments([]);
    setPaymentWarnMessage('');
  };

  useEffect(() => {
    if (completeOrderState.status === 'success') {
      setDiscount('');
      setSelectedPayments([]);
      setPaymentWarnMessage('');
      completeOrderState.reset?.();
    }
  }, [completeOrderState]);

  return (
    <View className="flex-1 justify-between">
      <View className="flex-row justify-between items-center bg-slate-50 border-b-2 border-gray-200 py-3 p-4 mb-2">
        <Text style={{ fontSize: 20 }} className="text-lg font-semibold text-deepTeal">
          Selected Table
        </Text>
        <Text style={{ fontSize: 20 }} className="text-lg font-semibold text-slate-500">
          {currentTable}
        </Text>
      </View>

      {/* Food Items Summary Section */}
      <RegisterOrderItemsSummary
        items={items}
        updateQuantity={updateQuantity}
        orderId={tableItems.id > 0 ? '#' + tableItems.id.toString() : ''}
      />

      {/* Payment Methods */}
      <PaymentMethodsSelector
        totalAmount={tableItems.totalPrice}
        selectedPayments={selectedPayments}
        showSplitPaymentInfo={true}
        onPaymentsChange={setSelectedPayments}
      />

      {/* Discount Input */}
      <View className="flex-row justify-between items-center mb-4 pt-4">
        {/* Discount Label */}
        <IconLabel
          iconName="pricetag-outline"
          label={'Discount'}
          containerStyle="justify-between"
          iconType="Ionicons"
        />

        {/* Discount Input Field */}
        <TextInput
          placeholder="Enter discount amount"
          keyboardType="numeric"
          value={discount.toString()}
          className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3 focus:border-deepTeal focus:ring focus:ring-deepTeal/30"
          onChangeText={(text) => {
            applyDiscount(parseFloat(text) || 0);
          }}
        />
      </View>

      <CollapsibleInfo
        label="Reset Payments?"
        containerStyle="ml-8"
        textColor="text-black font-bold underline"
        showIcon={false}
        onPress={reset}
      />

      {/* Divider */}
      <View className="w-full h-px bg-gray-300 my-3" />

      {/* Subtotal, Discount, Total */}
      <BillingSummaryCard
        subTotal={tableItems.subTotal}
        discountAmount={tableItems.discountAmount}
        totalPrice={tableItems.totalPrice}
      />

      {/* Complete Order Button */}
      <LoadingButton
        title="Complete Order"
        onPress={onCompletePress}
        buttonState={completeOrderState}
        disabled={selectedPayments.length === 0}
        buttonStyle={{ paddingVertical: 14 }}
        textStyle={{ fontSize: 20 }}
      />

      <NotificationBar
        message={paymentWarnMessage}
        onClose={() => setPaymentWarnMessage('')}
        variant="warn"
        topPosition={140}
      />

      <NotificationWithButtons
        message={paymentConfirmationMessage}
        onClose={() => setPaymentConfirmationMessage('')}
        type="info"
        width={380}
        onConfirm={(note) => {
          const selectedPaymentsWithNote = selectedPayments.map((p) => (p ? { ...p, note } : p));
          handleCompleteOrder(selectedPaymentsWithNote);
          setPaymentConfirmationMessage('');
        }}
      />
    </View>
  );
};

export default RegisterPaymentDetails;
