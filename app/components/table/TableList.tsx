import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import TableMetrics from 'app/components/table/TableMetrics';
import { RestaurantTable } from 'app/api/services/tableService';
import { SwipeTableCard } from './SwipeTableCard';

interface TableListProps {
  tables: RestaurantTable[];
  availableTables: number;
  occupiedTables: number;
  totalCapacity: number;
  activeOrders: number;
  isLargeScreen: boolean;
  onGoToMenu: (tableName: string) => void;
  onGoToCart: (tableName: string) => void;
  onSwitchTable: (tableName: string) => void;
  fetchTable: () => void;
}

export default function TableList({
  tables,
  availableTables,
  occupiedTables,
  totalCapacity,
  activeOrders,
  isLargeScreen,
  onGoToMenu,
  onGoToCart,
  onSwitchTable,
  fetchTable,
}: TableListProps) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTable();
    setRefreshing(false);
  }, [fetchTable]);

  return (
    <View className="flex-1 bg-gray-100 p-2">
      {/* Top Header Section */}
      <TableMetrics
        availableTables={availableTables}
        occupiedTables={occupiedTables}
        totalCapacity={totalCapacity}
        activeOrders={activeOrders}
        isLargeScreen={isLargeScreen}
      />

      {/* Tables Grid with Wrapping */}
      <ScrollView
        contentContainerStyle={[
          { gap: 4 },
          isLargeScreen && {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tables.map((table, index) => (
          <SwipeTableCard
            key={index}
            name={table.tableName}
            status={table.status}
            seats={table.capacity}
            items={table.orderItemsCount}
            onGoToMenu={() => onGoToMenu(table.tableName)}
            onGoToCart={() => onGoToCart(table.tableName)}
            onSwitchTable={() => onSwitchTable(table.tableName)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
