import { PaymentDistribution } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';
import EmptyState from '../common/EmptyState';

interface Props {
  paymentMethods: PaymentDistribution[];
}

const PaymentMethodDistribution: React.FC<Props> = ({ paymentMethods }) => {
  return (
    <View className="bg-white border-b border-gray-200 rounded-lg p-5 mt-4">
      <Text className="text-lg font-bold mb-5">Payment Methods Distribution</Text>
      {!paymentMethods || paymentMethods.length === 0 ? (
        <EmptyState
          iconName="credit-card-outline"
          message="No Payment available"
          subMessage="Complete order or refresh the screen!."
          iconSize={60}
        />
      ) : (
        <>
          {paymentMethods.map((method, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-800">{method.method}</Text>
                <Text className="text-gray-800">{method.percentage}%</Text>
              </View>
              <View className="h-2 rounded-full bg-gray-200">
                <View
                  className={`h-2 rounded-full ${
                    method.method === 'Cash'
                      ? 'bg-green-500'
                      : method.method === 'QR Payment'
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                  }`}
                  style={{ width: `${method.percentage}%` }}
                />
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default PaymentMethodDistribution;
