import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { RestaurantTable } from 'app/api/services/tableService';
import RegisterTableCard from './RegisterTableCard';
import EmptyState from 'app/components/common/EmptyState';

interface RegisterTableListProps {
  tables: RestaurantTable[];
  currentTable: string;
  numColumnsRegisterScreen: number;
  screenWidth: number;
  onSelectTable: (selectedTable: string) => void;
  refetchTables: () => void;
  handleAddNewTableClick: () => void;
}

const RegisterTableList: React.FC<RegisterTableListProps> = ({
  tables,
  numColumnsRegisterScreen,
  screenWidth,
  currentTable,
  onSelectTable,
  refetchTables,
  handleAddNewTableClick,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchTables();
    setRefreshing(false);
  };

  if (!tables || tables.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <EmptyState
          iconName="table-off"
          message="No tables available"
          subMessage="Please add tables to start taking orders."
          iconSize={90}
          onAddPress={() => handleAddNewTableClick()}
          addButtonLabel="Add New Table"
        />
      </View>
    );
  }

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
