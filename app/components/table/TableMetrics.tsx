import React from 'react';
import { ScrollView, View } from 'react-native';
import { TableMetricsSummaryCard } from './TableMetricsSummaryCard';

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
  // Create a variable to hold the cards to avoid duplication.
  const cards = (
    <>
      <TableMetricsSummaryCard
        icon="checkmark-circle-outline"
        iconColor="#10B981"
        title="Available Tables"
        value={availableTables}
        bgColor="bg-green-100"
      />
      <TableMetricsSummaryCard
        icon="close-circle-outline"
        iconColor="#EF4444"
        title="Occupied Tables"
        value={occupiedTables}
        bgColor="bg-red-100"
      />
      <TableMetricsSummaryCard
        icon="people-outline"
        iconColor="#3B82F6"
        title="Total Capacity"
        value={totalCapacity}
        bgColor="bg-blue-100"
      />
      <TableMetricsSummaryCard
        icon="restaurant-outline"
        iconColor="#8B5CF6"
        title="Active Orders"
        value={activeOrders}
        bgColor="bg-purple-100"
      />
    </>
  );
  return (
    <View className="flex-row justify-between mb-4 m-2">
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
