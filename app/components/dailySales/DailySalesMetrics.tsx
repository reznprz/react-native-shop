import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import HomeSummaryCard from '../common/SummaryCard';

type DailySalesMetricsProps = {
  totalOverallSales: number;
  thisMonth: number;
  today: number;
  unpaid: number;
  expensesAmount: number;
  isLargeScreen: boolean;
};

export const DailySalesMetrics: React.FC<DailySalesMetricsProps> = ({
  totalOverallSales,
  thisMonth,
  today,
  unpaid,
  expensesAmount,
  isLargeScreen,
}) => {
  const cards = (
    <>
      <HomeSummaryCard
        title="All Sales"
        amount={totalOverallSales.toString()}
        icon={<FontAwesome5 name="coins" size={20} color="#3B82F6" />}
        iconBgColor={'bg-blue-200 '}
        width="w-1/4"
      />
      <HomeSummaryCard
        title="This Month"
        amount={thisMonth.toString()}
        icon={<Feather name="bar-chart-2" size={20} color="#10B981" />}
        iconBgColor={'bg-green-100'}
        width="w-1/4"
      />
      <HomeSummaryCard
        title={expensesAmount > 0 ? 'Expense' : "Today's Sales"}
        amount={expensesAmount > 0 ? expensesAmount.toString() : today.toString()}
        icon={<FontAwesome5 name="check-circle" size={20} color="#8B5CF6" />}
        iconBgColor={' bg-purple-200 '}
        width="w-1/4"
      />
      <HomeSummaryCard
        title="Unpaid"
        amount={unpaid.toString()}
        icon={<FontAwesome5 name="clock" size={20} color="#EF4444" />}
        iconBgColor={'bg-red-100'}
        width="w-1/4"
      />
    </>
  );

  return (
    <View className="flex-row justify-between mb-4">
      {isLargeScreen ? (
        cards
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
            width: 'auto',
          }}
        >
          {cards}
        </ScrollView>
      )}
    </View>
  );
};
