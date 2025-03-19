import { DailySalesTransaction } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  salesTransaction: DailySalesTransaction;
}

const DailySalesTransactionCard: React.FC<Props> = ({ salesTransaction }) => {
  const { openingCash, expenses, totalSales } = salesTransaction;

  // Calculated closing cash if needed
  const closingCash = openingCash + totalSales - expenses;

  return (
    <View className="bg-white rounded-lg p-5 mt-4 shadow-sm">
      <Text className="text-lg font-bold mb-5">Daily Sales Transaction</Text>

      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-gray-600">Opening Cash</Text>
          <Text className="text-black font-semibold mt-1">रु {openingCash.toFixed(2)}</Text>
        </View>
        <View>
          <Text className="text-gray-600">Closing Cash</Text>
          <Text className="text-black font-semibold mt-1">रु {closingCash.toFixed(2)}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-gray-600">Expenses</Text>
          <Text className="text-red-500 font-semibold mt-1">-रु {expenses.toFixed(2)}</Text>
        </View>
        <View>
          <Text className="text-gray-600">Total Sales</Text>
          <Text className="text-green-600 font-semibold mt-1">रु {totalSales.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default DailySalesTransactionCard;
