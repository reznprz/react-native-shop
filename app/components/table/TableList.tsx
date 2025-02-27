import React from 'react';
import { View, ScrollView } from 'react-native';
import { TableCard } from 'app/components/table/TableCard';
import TableMetrics from 'app/components/table/TableMetrics';

interface TableListProps {
  tables: { name: string; status: string; seats: number; items: number }[];
  availableTables: number;
  occupiedTables: number;
  totalCapacity: number;
  activeOrders: number;
  isLargeScreen: boolean;
  onGoToMenu: (tableName: string) => void;
  onGoToCart: (tableName: string) => void;
  onSwitchTable: (tableName: string) => void;
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
}: TableListProps) {
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
      >
        {tables.map((table, index) => (
          <TableCard
            key={index}
            name={table.name}
            status={table.status}
            seats={table.seats}
            items={table.items}
            onGoToMenu={() => onGoToMenu(table.name)}
            onGoToCart={() => onGoToCart(table.name)}
            onSwitchTable={() => onSwitchTable(table.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
