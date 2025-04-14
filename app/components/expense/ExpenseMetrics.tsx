import React from 'react';
import { ScrollView, View } from 'react-native';
import ExpenseSummaryCard from '../common/SummaryCard';
import { Ionicons, Feather } from '@expo/vector-icons';

type ExpenseMetricsProps = {
  totalExpenses: number;
  thisMonthExpenses: number;
  todayExpenses: number;
  isLargeScreen: boolean;
};

export const ExpenseMetrics: React.FC<ExpenseMetricsProps> = ({
  totalExpenses,
  thisMonthExpenses,
  todayExpenses,
  isLargeScreen,
}) => {
  const cards = (
    <>
      <ExpenseSummaryCard
        title="All Expenses"
        amount={totalExpenses.toString()}
        icon={<Ionicons name="wallet" size={20} color="#3B82F6" />}
        iconBgColor={'bg-blue-200 '}
      />
      <ExpenseSummaryCard
        title="This Month"
        amount={thisMonthExpenses.toString()}
        icon={<Feather name="bar-chart-2" size={20} color="#10B981" />}
        iconBgColor={'bg-green-100'}
      />
      <ExpenseSummaryCard
        title="Today"
        amount={todayExpenses.toString()}
        icon={<Ionicons name="time-outline" size={20} color="#8B5CF6" />}
        iconBgColor={' bg-purple-200 '}
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
          }}
        >
          {cards}
        </ScrollView>
      )}
    </View>
  );
};
