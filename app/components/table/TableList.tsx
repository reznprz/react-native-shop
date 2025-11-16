import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import TableMetrics from 'app/components/table/TableMetrics';
import { RestaurantTable } from 'app/api/services/tableService';
import { TableCard } from './TableCard';
import { RestaurantTheme } from 'app/theme/theme';

interface TableListProps {
  theme: RestaurantTheme;
  tables: RestaurantTable[];
  availableTables: number;
  occupiedTables: number;
  totalCapacity: number;
  activeOrders: number;
  isLargeScreen: boolean;
  isMobile: boolean;
  onGoToMenu: (tableName: string) => void;
  onGoToCart: (tableName: string) => void;
  onSwitchTable: (tableName: string) => void;
  fetchTable: () => void;
}

export default function TableList({
  theme,
  tables,
  availableTables,
  occupiedTables,
  totalCapacity,
  activeOrders,
  isLargeScreen,
  isMobile,
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
    <View className="flex-1 p-2" style={{ backgroundColor: theme.primaryBg }}>
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
          !isMobile && {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tables.map((table, index) => (
          <TableCard
            key={index}
            name={table.tableName}
            status={table.status}
            seats={table.capacity}
            items={table.orderItemsCount}
            onGoToMenu={() => onGoToMenu(table.tableName)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
