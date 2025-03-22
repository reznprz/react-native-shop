import { OrderDetails } from 'app/api/services/orderService';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import EmptyState from '../common/EmptyState';
import { StatusChip } from '../common/StatusChip';
import CustomButton from '../common/button/CustomButton';

interface Props {
  recentTransactions: OrderDetails[];
  isLargeScreen: boolean;
  onViewAllPress: () => void;
}

const RecentTransactionsSummary: React.FC<Props> = ({
  recentTransactions,
  isLargeScreen,
  onViewAllPress,
}) => {
  return (
    <View className="bg-white rounded-lg p-5 mt-4 shadow-sm">
      {!recentTransactions || recentTransactions.length === 0 ? (
        <EmptyState
          iconName="bag-personal-outlinenk"
          message="No Orders available"
          subMessage="Complete order or refresh the screen!."
          iconSize={60}
        />
      ) : (
        <>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-lg font-bold">Recent Transactions</Text>
            <CustomButton
              title="View All"
              onPress={() => onViewAllPress()}
              buttonType="TouchableOpacity"
              buttonStyle={{
                backgroundColor: 'transparent',
                paddingVertical: 0,
                paddingHorizontal: 0,
                elevation: 0,
              }}
              textStyle={{
                color: '#3b82f6',
                fontSize: 16,
                fontWeight: '500',
              }}
            />
          </View>

          {/* Table Header */}
          <View className="bg-gray-50 p-3 rounded-t-lg flex-row">
            <Text className="w-1/5 text-gray-500 font-semibold">ID</Text>
            <Text className="w-1/5 text-gray-500 font-semibold">Time</Text>
            <Text className="w-1/5 text-gray-500 font-semibold">Amount</Text>
            <Text className="w-1/5 text-gray-500 font-semibold">Payment</Text>
            <Text className="w-1/5 text-gray-500 font-semibold">Status</Text>
          </View>

          {/* Transactions */}
          {recentTransactions.map((transaction, index) => {
            const paymentMethods = transaction.payments
              .map((payment) => payment.paymentMethod)
              .join(', ');

            return (
              <View
                key={index}
                className="flex-row items-center p-3 border-b border-gray-200 last:border-b-0"
              >
                <Text className="w-1/5 text-black">#{transaction.orderId}</Text>
                <Text className="w-1/5 text-black">{transaction.timeStamp.completedTime}</Text>
                <Text className="w-1/5 text-black">रु {transaction.totalAmount.toFixed(2)}</Text>
                <Text className="w-1/5 text-black" numberOfLines={1} ellipsizeMode="tail">
                  {paymentMethods}
                </Text>
                {isLargeScreen ? (
                  <StatusChip status={transaction.orderStatus} />
                ) : (
                  <Text className="w-1/5 text-black" numberOfLines={1} ellipsizeMode="tail">
                    {transaction.orderStatus}
                  </Text>
                )}
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

export default RecentTransactionsSummary;
