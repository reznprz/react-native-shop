import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import HomeSummaryCard from '../common/SummaryCard';

type RestaurantOverviewMetricsProps = {
  totalSales: number;
  totalOrders: number;
  totalExpenses: number;
  activeTables: number;
  isLargeScreen: boolean;
};

export const RestaurantOverviewMetrics: React.FC<RestaurantOverviewMetricsProps> = ({
  totalSales,
  totalOrders,
  totalExpenses,
  activeTables,
  isLargeScreen,
}) => {
  const cards = (
    <>
      <HomeSummaryCard
        title="Total's Sales"
        amount={totalSales.toString()}
        icon={<Ionicons name="wallet" size={20} color="#3B82F6" />}
        iconBgColor={'bg-blue-200 '}
        width="w-1/4"
      />
      <HomeSummaryCard
        title="Total Orders"
        amount={totalOrders.toString()}
        icon={<Feather name="bar-chart-2" size={20} color="#10B981" />}
        iconBgColor={'bg-green-100'}
        width="w-1/4"
      />
      <HomeSummaryCard
        title="Expenses"
        amount={totalExpenses.toString()}
        icon={<Ionicons name="time-outline" size={20} color="#8B5CF6" />}
        iconBgColor={' bg-purple-200 '}
        width="w-1/4"
      />
      <HomeSummaryCard
        title="Orders Count"
        amount={totalOrders.toString()}
        icon={<Feather name="bar-chart-2" size={20} color="#10B981" />}
        iconBgColor={'bg-green-100'}
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
