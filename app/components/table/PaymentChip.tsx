import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getPaymentTypeIcon } from 'app/hooks/utils/getPaymentTypeIcon';
import IconLabel from '../common/IconLabel';

interface PaymentChipProps {
  paymentType: string;
  isSelected?: boolean;
  onSelect?: (paymentType: string) => void;
}

const PaymentChip: React.FC<PaymentChipProps> = ({ paymentType, isSelected = false, onSelect }) => {
  if (onSelect) {
    return (
      <Pressable
        onPress={() => onSelect(paymentType)}
        className={`w-16 h-20 rounded-lg border border-gray-300 flex items-center justify-between p-2 ${
          isSelected ? 'bg-deepTeal' : 'bg-paleSkyBlue'
        }`}
      >
        <FontAwesome5
          name={getPaymentTypeIcon(paymentType)}
          size={20}
          color={isSelected ? '#fff' : '#000'}
        />
        <Text
          className={`text-base ${isSelected ? 'text-white' : 'text-black'}`}
        >{`${paymentType}`}</Text>
      </Pressable>
    );
  }

  return (
    <IconLabel
      label={`Paid with ${paymentType}`}
      iconName={getPaymentTypeIcon(paymentType)}
      containerStyle="ml-1"
      textColor="text-gray-500"
      labelTextSize="text-base ml-2"
      applyCircularIconBg={false}
      iconColor="gray"
    />
  );
};

export default PaymentChip;
