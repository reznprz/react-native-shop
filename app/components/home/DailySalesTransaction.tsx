import { DailySalesTransaction } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../common/button/CustomButton';

interface Props {
  title?: string;
  showOpeningAndClosingCash?: boolean;
  salesTransaction: DailySalesTransaction;
  onViewAllPress?: () => void;
  fontSize?: number;
}

const DailySalesTransactionCard: React.FC<Props> = ({
  title = 'Daily Sales Transaction',
  showOpeningAndClosingCash = true,
  salesTransaction,
  onViewAllPress,
  fontSize = 14,
}) => {
  const { openingCash, expenses, totalSales, closingCash, cash, qr } = salesTransaction;

  return (
    <View className="bg-white rounded-lg p-6 mt-4 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="font-bold" style={{ fontSize: fontSize + 2 }}>
          {title}
        </Text>
        {onViewAllPress && (
          <CustomButton
            title="View All"
            onPress={onViewAllPress}
            buttonType="TouchableOpacity"
            buttonStyle={{
              backgroundColor: 'transparent',
              paddingVertical: 0,
              paddingHorizontal: 0,
              elevation: 0,
            }}
            textStyle={{
              color: '#3b82f6',
              fontSize: fontSize,
              fontWeight: '500',
            }}
          />
        )}
      </View>

      {showOpeningAndClosingCash && (
        <>
          {/* Row: Opening and Closing */}
          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-gray-600" style={{ fontSize }}>
                Opening Cash
              </Text>
              <Text className="text-black font-semibold mt-2" style={{ fontSize }}>
                रु {openingCash.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text className="text-gray-600" style={{ fontSize }}>
                Closing Cash
              </Text>
              <Text className="text-black font-semibold mt-2" style={{ fontSize }}>
                रु {closingCash.toFixed(2)}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Row: Expenses and Sales */}
      <View className="flex-row justify-between mb-5 mr-4">
        <View>
          <Text className="text-gray-600" style={{ fontSize }}>
            Expenses
          </Text>
          <Text
            className="font-semibold mt-2"
            style={{
              fontSize,
              color: '#ef4444',
            }}
          >
            {'-रु'} {Math.abs(expenses).toFixed(2)}
          </Text>
        </View>
        <View>
          <Text className="text-gray-600 " style={{ fontSize }}>
            Total Sales
          </Text>
          <Text className="text-green-600 font-semibold mt-2" style={{ fontSize }}>
            रु {totalSales.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Row: Cash and QR */}
      <View className="flex-row justify-between mr-4">
        <View>
          <Text className="text-gray-600" style={{ fontSize }}>
            Cash
          </Text>
          <Text className="text-green-600 font-semibold mt-2" style={{ fontSize }}>
            रु {cash.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text className="text-gray-600" style={{ fontSize }}>
            Qr Amount
          </Text>
          <Text className="text-black font-semibold mt-2" style={{ fontSize }}>
            रु {qr.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DailySalesTransactionCard;
