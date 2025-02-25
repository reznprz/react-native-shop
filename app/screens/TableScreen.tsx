import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TableCard } from 'app/components/table/TableCard';
import { useTables } from 'app/hooks/useTables';
import { SummaryCard } from 'app/components/common/SummaryCard';

export default function TableScreen() {
  const { tables, availableTables, occupiedTables, totalCapacity, activeOrders } = useTables();

  // Handlers for Actions Menu
  const handleGoToMenu = (tableName: string) => console.log('Go to menu:', tableName);
  const handleGoToCart = (tableName: string) => console.log('Go to cart:', tableName);
  const handleSwitchTable = (tableName: string) => console.log('Switch table:', tableName);

  return (
    <View className="relative flex-1 bg-gray-100 p-1">
      {/* Top Header Section */}
      <View className="flex flex-row flex-wrap justify-between gap-4">
        <SummaryCard
          icon="checkmark-circle-outline"
          iconColor="green"
          title="Available Tables"
          value={availableTables}
        />
        <SummaryCard
          icon="close-circle-outline"
          iconColor="red"
          title="Occupied Tables"
          value={occupiedTables}
        />
        <SummaryCard
          icon="people-outline"
          iconColor="blue"
          title="Total Capacity"
          value={totalCapacity}
        />
        <SummaryCard
          icon="restaurant-outline"
          iconColor="purple"
          title="Active Orders"
          value={activeOrders}
        />
      </View>

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
