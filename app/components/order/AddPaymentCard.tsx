import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import CollapsibleComponent from '../common/CollapsibleComponent';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import NotificationBar from '../common/NotificationBar';
import NotificationWithButtons from '../NotificationWithButtons';
import { PAYMENT_WARN_MESSAGES } from 'app/constants/constants';
import { PaymentInfo } from 'app/hooks/useTables';
import LoadingButton, { ButtonState } from '../common/button/LoadingButton';
import PaymentMethodsSelector from '../PaymentMethodsSelector';

type AddPaymentCardProps = {
  order: OrderDetails;
  containerStyle?: string;
  addPaymentState: ButtonState;
  handleAddPayment: (orderId: number, payments: PaymentInfo[]) => void;
};

const AddPaymentCard: React.FC<AddPaymentCardProps> = ({
  order,
  containerStyle,
  addPaymentState,
  handleAddPayment,
}) => {
  const paidAmount =
    order.payments
      ?.filter((p) => p.paymentMethod !== 'CREDIT')
      .reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;
  const unpaidAmount = order.totalAmount - paidAmount;
  const [selectedPayments, setSelectedPayments] = useState<PaymentInfo[]>([]);
  const [paymentWarnMessage, setPaymentWarnMessage] = useState('');
  const [paymentConfirmationMessage, setPaymentConfirmationMessage] = useState('');

  const onAddPaymentPress = useCallback(() => {
    const totalPaymentsAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
    if (selectedPayments.length > 1) {
      if (totalPaymentsAmount > unpaidAmount) {
        setPaymentWarnMessage(
          `${PAYMENT_WARN_MESSAGES.PAYMENTS_TOTAL_INCORRECT} : TotalPaymentAmount: ${totalPaymentsAmount}`,
        );
        return;
      }
      if (totalPaymentsAmount < unpaidAmount) {
        setPaymentConfirmationMessage(
          `${PAYMENT_WARN_MESSAGES.PAYMENTS_CONFORMATION} : TotalPaymentAmount: ${totalPaymentsAmount}`,
        );
        return;
      }
    } else if (selectedPayments.length === 1) {
      setPaymentConfirmationMessage(`${PAYMENT_WARN_MESSAGES.FULLY_PAID_NOTE} `);
      return;
    } else if (totalPaymentsAmount === unpaidAmount) {
      setPaymentConfirmationMessage(`${PAYMENT_WARN_MESSAGES.FULLY_PAID_NOTE} `);
    }
    setPaymentWarnMessage('');
  }, [selectedPayments, unpaidAmount, handleAddPayment]);

  return (
    <View className={`${containerStyle}`}>
      <CollapsibleComponent
        title="Add Payment"
        show={true}
        iconName="money-bill-wave"
        iconType="FontAwesome5"
      >
        <View>
          {/* Paid and Unpaid Amounts */}
          <View className="flex-row justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm mb-2">
            {paidAmount > 0 && (
              <IconLabel
                label="Paid"
                iconType="FontAwesome5"
                iconName="check-circle"
                iconSize={20}
                iconColor="#10B981"
                labelTextSize="text-lg font-semibold text-green-700 ml-2"
                subLabel={`रु ${paidAmount.toLocaleString()}`}
                bgColor="bg-green-100"
                containerStyle="p-2 rounded-lg"
              />
            )}
            <IconLabel
              label="Unpaid"
              iconType="FontAwesome5"
              iconName="clock"
              iconSize={20}
              iconColor="#EF4444"
              labelTextSize="text-lg font-semibold text-red-700 ml-2"
              subLabel={`रु ${unpaidAmount.toLocaleString()}`}
              bgColor="bg-red-100"
              containerStyle="p-2 rounded-lg"
            />
          </View>

          {/* Payment Methods */}
          <PaymentMethodsSelector
            totalAmount={unpaidAmount}
            selectedPayments={selectedPayments}
            onPaymentsChange={setSelectedPayments}
          />

          {/* Centered Add Payment Button */}
          <LoadingButton
            title="Add Payment"
            customButtonStyle="w-1/2 self-center flex items-center justify-center rounded-lg px-4 py-4 bg-[#2a4759] shadow-md mt-4"
            textSize="text-xl font-semibold text-white"
            onPress={onAddPaymentPress}
            buttonState={addPaymentState}
            disabled={selectedPayments.length === 0}
          />
        </View>
      </CollapsibleComponent>

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
          const selectedPaymentsWithNote = selectedPayments.map((p) => ({
            ...p,
            note,
            amount: selectedPayments.length === 1 ? unpaidAmount : p.amount,
          }));

          handleAddPayment(order.orderId, selectedPaymentsWithNote);
          setPaymentConfirmationMessage('');
        }}
      />
    </View>
  );
};

export default AddPaymentCard;
