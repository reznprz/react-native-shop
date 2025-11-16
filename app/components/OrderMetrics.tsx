import React from 'react';
import { ScrollView, View } from 'react-native';
import { MetricsSummaryCard } from './common/MetricsSummaryCard';
import { useTheme } from 'app/hooks/useTheme';

type OrderMetricsProps = {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  totalOrders: number;
  isLargeScreen: boolean;
};

const OrderMetrics: React.FC<OrderMetricsProps> = ({
  totalAmount,
  paidAmount,
  unpaidAmount,
  totalOrders,
  isLargeScreen,
}) => {
  const theme = useTheme();

  // Create a variable to hold the cards to avoid duplication.
  const cards = (
    <>
      <MetricsSummaryCard
        title="Total Amount"
        value={`${Number(totalAmount || 0).toFixed(2)}`}
        subtitle="+12.5% from yesterday"
        icon="coins"
        iconColor="#3B82F6"
        bgColor="#DBEAFE"
        iconType="FontAwesome5"
      />

      <MetricsSummaryCard
        title="Paid Amount"
        value={`$${Number(paidAmount || 0).toFixed(2)}`}
        subtitle="85% of total orders"
        icon="check-circle"
        iconColor="#10B981"
        bgColor="#DCFCE7"
        iconType="FontAwesome5"
      />

      <MetricsSummaryCard
        title="Unpaid Amount"
        value={`$${Number(unpaidAmount || 0).toFixed(2)}`}
        subtitle="15% of total orders"
        icon="clock"
        iconColor="#EF4444"
        bgColor="#FEE2E2"
        textColor="text-red-600"
        iconType="FontAwesome5"
      />

      <MetricsSummaryCard
        title="Total Orders"
        value={totalOrders}
        subtitle="+8 new orders today"
        icon="receipt"
        iconColor="#8B5CF6"
        bgColor="#EDE9FE"
        iconType="FontAwesome5"
      />
    </>
  );
  return (
    <View className="flex-row justify-between mb-4 ">
      {isLargeScreen ? (
        cards
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16, // equivalent to mb-4
          }}
        >
          {cards}
        </ScrollView>
      )}
    </View>
  );
};

export default OrderMetrics;
