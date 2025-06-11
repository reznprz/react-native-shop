import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import IconLabel from '../common/IconLabel';
import { PaymentInfo, TableItem } from 'app/hooks/useTables';
import LoadingButton, { ButtonState } from '../common/button/LoadingButton';
import { PAYMENT_WARN_MESSAGES } from 'app/constants/constants';
import NotificationWithButtons from '../NotificationWithButtons';
import NotificationBar from '../common/NotificationBar';
import PaymentMethodsSelector from '../PaymentMethodsSelector';
import PaymentDetailsFoodItemsSummary from './PaymentDetailsFoodItemsSummary';
import BillingSummaryCard from './BillingSummaryCard';
import CollapsibleInfo from '../common/CollapsibleInfo';

interface PaymentDetailsProps {
  tableItems: TableItem;
  setDiscount: (amount: number) => void;
  handleCompleteOrder: (selectedPayments: PaymentInfo[]) => void;
  completeOrderState: ButtonState;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  tableItems,
  setDiscount,
  handleCompleteOrder,
  completeOrderState,
}) => {
  const items = tableItems?.orderItems || [];
  const [selectedPayments, setSelectedPayments] = useState<PaymentInfo[]>([]);
  const [paymentWarnMessage, setPaymentWarnMessage] = useState('');
  const [paymentConfirmationMessage, setPaymentConfirmationMessage] = useState('');
  const [discountAmt, setDiscountAmt] = useState('');

  const applyDiscount = useCallback(
    (amount: number) => {
      if (amount > 0 && selectedPayments.length > 1) {
        setSelectedPayments([]);
        setPaymentWarnMessage(PAYMENT_WARN_MESSAGES.REST_PAYMENTS);
      }
      setDiscount(amount);
      setDiscountAmt(amount.toString());
    },
    [selectedPayments],
  );

  const reset = () => {
    setDiscountAmt('');
    setSelectedPayments([]);
    setPaymentWarnMessage('');
  };

  const onCompletePress = useCallback(() => {
    const totalPaymentsAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
    console.log('Total Payments Amount:', totalPaymentsAmount);
    if (selectedPayments.length > 1) {
      console.log('Multiple payments selected:', selectedPayments);
      if (totalPaymentsAmount > tableItems.totalPrice) {
        console.log(PAYMENT_WARN_MESSAGES.PAYMENTS_TOTAL_INCORRECT, selectedPayments);
        setPaymentWarnMessage(
          `${PAYMENT_WARN_MESSAGES.PAYMENTS_TOTAL_INCORRECT} : TotalPaymentAmount: ${totalPaymentsAmount}`,
        );
        return;
      }
      if (totalPaymentsAmount < tableItems.totalPrice) {
        console.log(PAYMENT_WARN_MESSAGES.PAYMENTS_CONFORMATION, selectedPayments);

        setPaymentConfirmationMessage(
          `${PAYMENT_WARN_MESSAGES.PAYMENTS_CONFORMATION} : TotalPaymentAmount: ${totalPaymentsAmount}`,
        );
        return;
      }
    }
    handleCompleteOrder(selectedPayments);
    setPaymentWarnMessage('');
  }, [selectedPayments, tableItems.totalPrice, handleCompleteOrder]);

  return (
    <View className="p-4 flex-1 justify-between">
      {/* Heading */}
      <IconLabel iconName="cash-register" label={'Payment Details'} />

      {/* Food Items Summary Section */}
      {items && items.length > 0 ? <PaymentDetailsFoodItemsSummary items={items} /> : null}

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
          value={discountAmt.toString()}
          className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3 focus:border-deepTeal focus:ring focus:ring-deepTeal/30"
          onChangeText={(text) => applyDiscount(parseFloat(text) || 0)}
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
        onPress={() => {
          console.log('Complete Order Pressed with selected payments:', selectedPayments);
          onCompletePress();
        }}
        buttonState={completeOrderState}
        disabled={selectedPayments.length === 0}
        buttonStyle={{ paddingVertical: 14 }}
        textStyle={{ fontSize: 20 }}
      />

      <NotificationBar
        message={paymentWarnMessage}
        onClose={() => setPaymentWarnMessage('')}
        variant="warn"
        topPosition={items.length > 3 ? 580 + (items.length * 50 || 1) : 480}
      />

      <NotificationWithButtons
        message={paymentConfirmationMessage}
        onClose={() => setPaymentConfirmationMessage('')}
        type="info"
        width={380}
        topPosition={items.length > 3 ? 680 + items.length * 15 : 480}
        onConfirm={(note) => {
          const selectedPaymentsWithNote = selectedPayments.map((p) => (p ? { ...p, note } : p));
          handleCompleteOrder(selectedPaymentsWithNote);
          setPaymentConfirmationMessage('');
        }}
      />
    </View>
  );
};

export default PaymentDetails;
