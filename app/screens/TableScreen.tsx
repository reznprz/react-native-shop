import React from 'react';
import { View, ScrollView } from 'react-native';
import { TableCard } from 'app/components/table/TableCard';
import { useTables } from 'app/hooks/useTables';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import TableMetrics from 'app/components/table/TableMetrics';

export default function TableScreen() {
  const { tables, availableTables, occupiedTables, totalCapacity, activeOrders } = useTables();
  const { isLargeScreen } = useIsDesktop();

  // Handlers for Actions Menu
  const handleGoToMenu = (tableName: string) => console.log('Go to menu:', tableName);
  const handleGoToCart = (tableName: string) => console.log('Go to cart:', tableName);
  const handleSwitchTable = (tableName: string) => console.log('Switch table:', tableName);

  return (
    <View className="relative flex-1 bg-gray-100 p-1">
      {/* Top Header Section */}

      <TableMetrics
        availableTables={availableTables}
        occupiedTables={occupiedTables}
        totalCapacity={totalCapacity}
        activeOrders={activeOrders}
        isLargeScreen={isLargeScreen}
      />

      {/* Tables Grid with wrapping */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {tables.map((table, index) => (
          <TableCard
            key={index}
            name={table.name}
            status={table.status}
            seats={table.seats}
            items={table.items}
            onGoToMenu={() => handleGoToMenu(table.name)}
            onGoToCart={() => handleGoToCart(table.name)}
            onSwitchTable={() => handleSwitchTable(table.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
