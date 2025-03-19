import { OrderDetails } from 'app/api/services/orderService';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import EmptyState from '../common/EmptyState';

interface Props {
  recentTransactions: OrderDetails[];
}

const RecentTransactionsSummary: React.FC<Props> = ({ recentTransactions }) => {
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
            <Text className="text-blue-600 font-medium">View All</Text>
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
          {recentTransactions.map((transaction, index) => (
            <View
              key={index}
              className="flex-row items-center p-3 border-b border-gray-200 last:border-b-0"
            >
              <Text className="w-1/5 text-black">#{transaction.orderId}</Text>
              <Text className="w-1/5 text-black">{transaction.timeStamp.completedTime}</Text>
              <Text className="w-1/5 text-black">रु {transaction.totalAmount.toFixed(2)}</Text>
              <Text className="w-1/5 text-black">{transaction.paymentMethod}</Text>
              <View className="w-1/5">
                <Text className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-center text-xs">
                  Completed
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default RecentTransactionsSummary;
