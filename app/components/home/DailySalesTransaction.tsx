import { DailySalesTransaction } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../common/button/CustomButton';

interface Props {
  salesTransaction: DailySalesTransaction;
  onViewAllPress?: () => void;
}

const DailySalesTransactionCard: React.FC<Props> = ({ salesTransaction, onViewAllPress }) => {
  const { openingCash, expenses, totalSales, closingCash, cash, date, qr } = salesTransaction;

  return (
    <View className="bg-white rounded-lg p-5 mt-4 shadow-sm">
      {/* <Text className="text-lg font-bold mb-5">Daily Sales Transaction</Text> */}
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5 ">
        <Text className="text-lg font-bold ">Daily Sales Transaction</Text>
        {onViewAllPress && (
          <CustomButton
            title="View All"
            onPress={() => {
              onViewAllPress();
            }}
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
        )}
      </View>

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

      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-gray-600">Expenses</Text>
          <Text className="text-red-500 font-semibold mt-1">-रु {expenses.toFixed(2)}</Text>
        </View>
        <View>
          <Text className="text-gray-600">Total Sales</Text>
          <Text className="text-green-600 font-semibold mt-1">रु {totalSales.toFixed(2)}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-gray-600">Cash</Text>
          <Text className="text-green-500 font-semibold mt-1">रु {cash.toFixed(2)}</Text>
        </View>
        <View>
          <Text className="text-gray-600">Qr</Text>
          <Text className="text-black-600 font-semibold mt-1"> रु {qr.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default DailySalesTransactionCard;
