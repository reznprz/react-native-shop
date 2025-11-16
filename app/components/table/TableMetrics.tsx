import React from 'react';
import { ScrollView, View } from 'react-native';
import { MetricsSummaryCard } from '../common/MetricsSummaryCard';
import { useTheme } from 'app/hooks/useTheme';

type TableMetricsProps = {
  availableTables: number;
  occupiedTables: number;
  totalCapacity: number;
  activeOrders: number;
  isLargeScreen: boolean;
};

const TableMetrics: React.FC<TableMetricsProps> = ({
  availableTables,
  occupiedTables,
  totalCapacity,
  activeOrders,
  isLargeScreen,
}) => {
  const theme = useTheme();

  // Create a variable to hold the cards to avoid duplication.
  const cards = (
    <>
      <MetricsSummaryCard
        icon="checkmark-circle-outline"
        iconColor="#10B981"
        title="Available Tables"
        value={availableTables}
        bgColor={theme.successBg}
      />

      <MetricsSummaryCard
        icon="close-circle-outline"
        iconColor="#EF4444"
        title="Occupied Tables"
        value={occupiedTables}
        bgColor={theme.errorBg}
      />

      <MetricsSummaryCard
        icon="people-outline"
        iconColor="#3B82F6"
        title="Total Capacity"
        value={totalCapacity}
        bgColor={theme.infoBg}
      />

      <MetricsSummaryCard
        icon="restaurant-outline"
        iconColor="#8B5CF6"
        title="Active Orders"
        value={activeOrders}
        bgColor={theme.alertBg}
      />
    </>
  );
  return (
    <View className="flex-row justify-between m-2">
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

export default TableMetrics;
