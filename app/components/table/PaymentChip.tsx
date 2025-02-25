import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getPaymentTypeIcon } from 'app/hooks/utils/getPaymentTypeIcon';
import { getPaymentTypeIconforIcons } from 'app/hooks/utils/getPaymentTypeIconforIcons';

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
        className={`w-24 h-20 rounded-lg border border-gray-300 flex items-center justify-between p-2 ${
          isSelected ? 'bg-deepTeal' : 'bg-white'
        }`}
      >
        <FontAwesome5
          name={getPaymentTypeIcon(paymentType)}
          size={28}
          color={isSelected ? '#fff' : '#000'}
        />
        <Text className={`text-sm ${isSelected ? 'text-white' : 'text-black'}`}>{paymentType}</Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center ml-1">
      <FontAwesome5 name={getPaymentTypeIcon(paymentType)} size={14} color="gray" />
      <Text className="text-gray-600 text-sm ml-2">{`Paid with ${paymentType}`}</Text>
    </View>
  );
};

export default PaymentChip;
