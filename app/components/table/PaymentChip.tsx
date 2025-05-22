import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getPaymentTypeIcon } from 'app/hooks/utils/getPaymentTypeIcon';
import IconLabel from '../common/IconLabel';
import { getIconDetail } from 'app/utils/getIconDetail';

interface PaymentChipProps {
  paymentType: string;
  isSelected?: boolean;
  amount?: number;
  textSize?: string;
  paymentText?: string;
  onSelect?: (paymentType: string) => void;
}

const PaymentChip: React.FC<PaymentChipProps> = ({
  paymentType,
  isSelected = false,
  amount,
  paymentText,
  textSize = 'text-base ml-2',
  onSelect,
}) => {
  const iconDetails = getIconDetail(paymentType, 'Payment');

  // assume `existingText` is whatever you’d shown before, or undefined/null if none
  const existingText: string | undefined = paymentText;

  // build the new text
  const newPaymentText =
    paymentType === 'CREDIT'
      ? `Credit amount: रु ${amount}`
      : existingText
        ? existingText
        : `Paid with ${paymentType} : रु ${amount}`;

  if (onSelect) {
    return (
      <Pressable
        onPress={() => onSelect(paymentType)}
        className={`flex-1 rounded-lg border border-gray-300 flex items-center justify-between p-2 ${
          isSelected ? 'bg-deepTeal' : 'bg-paleSkyBlue'
        }`}
      >
        <FontAwesome5
          name={getPaymentTypeIcon(paymentType)}
          size={20}
          color={isSelected ? '#fff' : '#000'}
        />
        <Text
          className={`${textSize} pl-1 pr-1 ${isSelected ? 'text-white' : 'text-black'}`}
        >{`${paymentType}`}</Text>
      </Pressable>
    );
  }

  return (
    <IconLabel
      label={newPaymentText}
      iconName={iconDetails.iconName}
      iconSize={iconDetails.iconSize}
      iconType={iconDetails.iconType}
      containerStyle="ml-1 mb-2"
      textColor="text-gray-500"
      labelTextSize={textSize ? textSize : 'text-sm ml-2'}
      applyCircularIconBg={false}
      iconColor="gray"
    />
  );
};

export default PaymentChip;
