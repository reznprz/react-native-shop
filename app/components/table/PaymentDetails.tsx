import React, { useCallback, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import PaymentChip from './PaymentChip';
import PaymentInput from './PaymentInput';
import IconLabel from '../common/IconLabel';
import { TableItem } from 'app/hooks/useTables';
import LoadingButton, { ButtonState } from '../common/button/LoadingButton';
import { PAYMENT_WARN_MESSAGES } from 'app/constants/constants';
import NotificationWithButtons from '../NotificationWithButtons';
import NotificationBar from '../common/NotificationBar';

const paymentTypes = ['CASH', 'ESEWA', 'FONE_PAY', 'CREDIT'];

interface PaymentDetailsProps {
  tableItems: TableItem;
  setDiscount: (amount: number) => void;
  handleCompleteOrder: (selectedPayments: SelectedPayment[]) => void;
  completeOrderState: ButtonState;
}

export interface SelectedPayment {
  paymentType: string;
  amount: number;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  tableItems,
  setDiscount,
  handleCompleteOrder,
  completeOrderState,
}) => {
  const items = tableItems?.orderItems || [];
  const [selectedPayments, setSelectedPayments] = useState<SelectedPayment[]>([]);
  const [paymentWarnMessage, setPaymentWarnMessage] = useState('');
  const [paymentConfirmationMessage, setPaymentConfirmationMessage] = useState('');

  const handlePaymentSelection = (type: string) => {
    setSelectedPayments((prev) => {
      const isSelected = prev.some((p) => p.paymentType === type);
      const newSelected = isSelected
        ? prev.filter((p) => p.paymentType !== type)
        : [...prev, { paymentType: type, amount: 0 }];
      return newSelected;
    });
  };

  const handleMultiplePaymentInputSelection = useCallback(
    (paymentType: string, amount: number) => {
      setSelectedPayments((prev) => {
        const paymentTypesTotal = prev.reduce((sum, p) => sum + p.amount, 0);
        if (prev.length === 2 && paymentTypesTotal === 0) {
          const remainingAmount = tableItems.totalPrice - amount;
          return prev.map((p) =>
            p.paymentType === paymentType ? { ...p, amount } : { ...p, amount: remainingAmount },
          );
        } else {
          return prev.map((p) => (p.paymentType === paymentType ? { ...p, amount } : p));
        }
      });
    },
    [tableItems.totalPrice],
  );

  const applyDiscount = useCallback(
    (amount: number) => {
      if (amount > 0 && selectedPayments.length > 1) {
        setSelectedPayments([]);
        setPaymentWarnMessage(PAYMENT_WARN_MESSAGES.REST_PAYMENTS);
      }
      setDiscount(amount);
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

  return (
    <View className="p-4 flex-1 justify-between">
      {/* Heading */}
      <IconLabel iconName="cash-register" label={'Payment Details'} />
      {/* Order Summary Section */}
      {items && items.length > 0 ? (
        <View className="mb-4 bg-gray-100 p-4 rounded-lg mt-2">
          <IconLabel iconName="receipt" label="Order Summary" />
          {items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-1">
              <View className="flex-row px-2 w-2/3">
                {/* Adjust width to prevent overflow */}
                <Text className="text-gray-700 flex-1" numberOfLines={2} ellipsizeMode="tail">
                  {item.productName}
                </Text>
                <Text className="text-gray-700 pl-2">{`x${item.quantity.toFixed(2)}`}</Text>
              </View>
              <Text
                className="text-gray-700 w-1/3 text-right"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {`$${(item.unitPrice * item.quantity).toFixed(2)}`}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Payment Methods */}
      <View className="bg-white mt-2">
        <IconLabel iconName="document-text-outline" label={'Payment Methods'} iconType="Ionicons" />

        {/* Payment Selection */}
        {paymentTypes.length > 0 && (
          <View className="flex-1 flex-row flex-wrap justify-center gap-2 mb-4">
            {paymentTypes.map((type, idx) => (
              <View key={idx} className="p-1">
                <PaymentChip
                  paymentType={type}
                  isSelected={selectedPayments.some((p) => p.paymentType === type)}
                  onSelect={(selectedPaymentType) => handlePaymentSelection(selectedPaymentType)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Render Payment Inputs Dynamically for Selected Methods */}
        {selectedPayments.length > 1 &&
          selectedPayments.map((payment, idx) => (
            <PaymentInput
              key={idx}
              amount={payment.amount}
              paymentType={payment.paymentType}
              onInput={(amount) => handleMultiplePaymentInputSelection(payment.paymentType, amount)}
            />
          ))}
      </View>
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
          className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3 focus:border-deepTeal focus:ring focus:ring-deepTeal/30"
          onChangeText={(text) => applyDiscount(parseFloat(text) || 0)}
        />
      </View>
      {/* Divider */}
      <View className="w-full h-px bg-gray-300 my-3" />
      {/* Subtotal, Discount, Total */}
      <View className="bg-white rounded-lg p-4 shadow-md">
        {/* Subtotal */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 text-base">{'Subtotal'}</Text>
          <Text className="text-gray-700 text-base">
            {Number(tableItems?.subTotal || 0).toFixed(2)}
          </Text>
        </View>

        {/* Discount */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 text-base">{'Discount'}</Text>
          {/* Red for negative amount */}
          <Text className="text-red-500 text-base">
            -{Number(tableItems?.discountAmount || 0).toFixed(2)}
          </Text>
        </View>

        {/* Total */}
        <View className="flex-row justify-between">
          <Text className="font-bold text-lg text-gray-900">{'Total'}</Text>
          <Text className="font-bold text-lg text-gray-900">
            {Number(tableItems?.totalPrice || 0).toFixed(2)}
          </Text>
        </View>
      </View>
      {/* Complete Order Button */}
      <LoadingButton
        title="Complete Order"
        onPress={onCompletePress}
        width="full"
        height="2l"
        textSize="text-xl"
        buttonState={completeOrderState}
        disabled={selectedPayments.length === 0}
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
        onConfirm={() => {
          handleCompleteOrder(selectedPayments);
          setPaymentConfirmationMessage('');
        }}
      />
    </View>
  );
};

export default PaymentDetails;
