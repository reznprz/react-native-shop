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
  onSelect?: (paymentType: string) => void;
}

const PaymentChip: React.FC<PaymentChipProps> = ({
  paymentType,
  isSelected = false,
  amount,
  onSelect,
}) => {
  const iconDetails = getIconDetail(paymentType, 'Payment');

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
          className={`text-base pl-1 pr-1 ${isSelected ? 'text-white' : 'text-black'}`}
        >{`${paymentType}`}</Text>
      </Pressable>
    );
  }

  return (
    <IconLabel
      label={`Paid with ${paymentType} : रु ${amount}`}
      iconName={iconDetails.iconName}
      iconSize={iconDetails.iconSize}
      iconType={iconDetails.iconType}
      containerStyle="ml-1 mb-2"
      textColor="text-gray-500"
      labelTextSize="text-sm ml-2"
      applyCircularIconBg={false}
      iconColor="gray"
    />
  );
};

export default PaymentChip;
