import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { RestaurantTable } from 'app/api/services/tableService';
import RegisterTableCard from './RegisterTableCard';

interface RegisterTableListProps {
  tables: RestaurantTable[];
  currentTable: string;
  numColumnsRegisterScreen: number;
  screenWidth: number;
  onSelectTable: (selectedTable: string) => void;
  refetchTables: () => void;
}

const RegisterTableList: React.FC<RegisterTableListProps> = ({
  tables,
  numColumnsRegisterScreen,
  screenWidth,
  currentTable,
  onSelectTable,
  refetchTables,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchTables();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={tables}
      numColumns={numColumnsRegisterScreen}
      key={numColumnsRegisterScreen}
      keyExtractor={(item) => item.tableName}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => (
        <RegisterTableCard
          name={item.tableName}
          status={item.status}
          seats={item.capacity}
          items={item.orderItemsCount}
          currentTable={currentTable}
          numColumnsRegisterScreen={numColumnsRegisterScreen}
          screenWidth={screenWidth}
          onSelectTable={onSelectTable}
        />
      )}
    />
  );
};

export default RegisterTableList;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
});
