import { DailySalesTransaction } from 'app/api/services/restaurantOverviewService';
import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../common/button/CustomButton';
import { RequirePermission } from 'app/security/RequirePermission';
import { Permission } from 'app/security/permission';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

  const { openingCash, expenses, totalSales, closingCash, cash, qr } = salesTransaction;

  return (
    <View className="rounded-lg p-6 mt-4 " style={{ backgroundColor: theme.secondaryBg }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="font-bold" style={{ fontSize: fontSize + 2, color: theme.textSecondary }}>
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
              color: theme.secondary,
              fontSize: fontSize,
              fontWeight: '800',
            }}
          />
        )}
      </View>

      {showOpeningAndClosingCash && (
        <>
          {/* Row: Opening and Closing */}
          <View className="flex-row justify-between mb-5">
            <View>
              <Text style={{ fontSize, color: theme.textSecondary }}>Opening Cash</Text>
              <Text
                className="text-black font-semibold mt-2"
                style={{ fontSize, color: theme.textSecondary }}
              >
                रु {openingCash.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize, color: theme.textSecondary }}>Closing Cash</Text>
              <Text className="font-semibold mt-2" style={{ fontSize, color: theme.textSecondary }}>
                रु {closingCash.toFixed(2)}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Row: Expenses and Sales */}
      <View className="flex-row justify-between mb-5 mr-4">
        <View>
          <Text style={{ fontSize, color: theme.textSecondary }}>Expenses</Text>
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
        <RequirePermission permission={Permission.VIEW_HOME_SCREEN_DAILYSALES_TOTALSALES_AMOUNT}>
          <View>
            <Text style={{ fontSize, color: theme.textSecondary }}>Total Sales</Text>
            <Text className="text-green-600 font-semibold mt-2" style={{ fontSize }}>
              रु {totalSales.toFixed(2)}
            </Text>
          </View>
        </RequirePermission>
      </View>

      <RequirePermission permission={Permission.VIEW_HOME_SCREEN_DAILYSALES_CASH_AND_QR_AMOUNT}>
        {/* Row: Cash and QR */}
        <View className="flex-row justify-between mr-4">
          <View>
            <Text style={{ fontSize, color: theme.textSecondary }}>Cash</Text>
            <Text className="text-green-600 font-semibold mt-2" style={{ fontSize }}>
              रु {cash.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize, color: theme.textSecondary }}>Qr Amount</Text>
            <Text className="text-black font-semibold mt-2" style={{ fontSize }}>
              रु {qr.toFixed(2)}
            </Text>
          </View>
        </View>
      </RequirePermission>
    </View>
  );
};

export default DailySalesTransactionCard;
