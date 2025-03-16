import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { PaymentInfo } from 'app/hooks/useTables';
import { PAYMENT_WARN_MESSAGES } from 'app/constants/constants';
import IconLabel from './common/IconLabel';
import CollapsibleInfo from './common/CollapsibleInfo';
import PaymentChip from './table/PaymentChip';
import PaymentInput from './table/PaymentInput';

interface PaymentMethodsSelectorProps {
  totalAmount: number;
  paymentTypes?: string[]; // defaults to ['CASH', 'ESEWA', 'FONE_PAY', 'CREDIT']
  selectedPayments: PaymentInfo[];
  onPaymentsChange?: (payments: PaymentInfo[]) => void;
  showSplitPaymentInfo?: boolean;
  splitPaymentInfoMessage?: string;
}

const PaymentMethodsSelector: React.FC<PaymentMethodsSelectorProps> = ({
  totalAmount,
  paymentTypes = ['CASH', 'ESEWA', 'FONE_PAY', 'CREDIT'],
  selectedPayments,
  onPaymentsChange,
  showSplitPaymentInfo = false,
  splitPaymentInfoMessage = PAYMENT_WARN_MESSAGES.SPLIT_PAYMENT_INFO,
}) => {
  const handlePaymentSelection = useCallback(
    (type: string) => {
      if (!onPaymentsChange) return;
      const isSelected = selectedPayments.some((p) => p.paymentType === type);

      // Create a new array of payments
      let newPayments: PaymentInfo[];
      if (isSelected) {
        // Remove already selected type
        newPayments = selectedPayments.filter((p) => p.paymentType !== type);
      } else {
        // Add a new payment with amount 0
        newPayments = [...selectedPayments, { paymentType: type, amount: 0 }];
      }

      onPaymentsChange(newPayments);
    },
    [selectedPayments, onPaymentsChange],
  );

  const handleMultiplePaymentInputSelection = useCallback(
    (paymentType: string, amount: number) => {
      if (!onPaymentsChange) return;

      // We'll recalc new payments
      const paymentTypesTotal = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
      let newPayments: PaymentInfo[];

      if (selectedPayments.length === 2 && paymentTypesTotal === 0) {
        const remainingAmount = totalAmount - amount;
        newPayments = selectedPayments.map((p) =>
          p.paymentType === paymentType ? { ...p, amount } : { ...p, amount: remainingAmount },
        );
      } else {
        newPayments = selectedPayments.map((p) =>
          p.paymentType === paymentType ? { ...p, amount } : p,
        );
      }

      onPaymentsChange(newPayments);
    },
    [totalAmount, selectedPayments, onPaymentsChange],
  );

  return (
    <View className="bg-white mt-2">
      <IconLabel iconName="document-text-outline" label="Payment Methods" iconType="Ionicons" />

      {showSplitPaymentInfo && (
        <CollapsibleInfo
          label="Split Payments ?"
          iconType="FontAwesome"
          iconName="question-circle"
          iconSize={24}
          iconColor="#2a4759"
          containerStyle="ml-8 mb-4"
          textColor="text-black font-bold underline"
          collapsibleContent={splitPaymentInfoMessage}
        />
      )}

      <View className="flex-1 flex-row flex-wrap justify-center gap-2 mb-4">
        {paymentTypes.map((type, idx) => (
          <View key={idx} className="p-1">
            <PaymentChip
              paymentType={type}
              textSize={'text-base'}
              isSelected={selectedPayments.some((p) => p.paymentType === type)}
              onSelect={handlePaymentSelection}
            />
          </View>
        ))}
      </View>

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
  );
};

export default PaymentMethodsSelector;
