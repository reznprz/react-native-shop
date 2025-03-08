import React from 'react';
import { Text, StyleSheet, ScrollView, Pressable, View } from 'react-native';
import BaseModal from '../common/modal/BaseModal';
import FilterChip from '../common/FilterChip';
import IconLabel from '../common/IconLabel';
import { RestaurantTable } from 'app/api/services/tableService';

interface TableListModalProps {
  visible: boolean;
  tables: RestaurantTable[];
  showAvailableIcon?: boolean;
  onClose: () => void;
  onSelectTable: (selectedTable: string) => void;
}

const TableListModal: React.FC<TableListModalProps> = ({
  visible,
  tables,
  showAvailableIcon = true,
  onClose,
  onSelectTable,
}) => {
  // Body: list of seats rendered in a ScrollView
  const bodyContent = (
    <>
      {showAvailableIcon && (
        <IconLabel
          label={'Available Tables'}
          iconType={'FontAwesome'}
          iconName={'question-circle'}
          iconSize={24}
          applyCircularIconBg={false}
          iconColor={'#2a4759'}
          containerStyle={'ml-2 mb-4'}
          textColor={'text-black font-bold underline'}
        />
      )}

      <ScrollView contentContainerStyle={styles.seatListContainer}>
        <View className="flex-row flex-wrap gap-1 pl-4 pr-4 pb-2">
          {tables.map((table, index) => (
            <FilterChip
              key={table.tableName}
              filterName={'Tables'}
              label={table.tableName}
              chipStatus={table.status}
              isSelected={false}
              onSelect={(value) => {
                onSelectTable(value);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      headerTitle="Select a Table"
      body={bodyContent}
      footer={
        <Pressable onPress={onClose} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Cancel</Text>
        </Pressable>
      }
    />
  );
};

const styles = StyleSheet.create({
  seatListContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  seatItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  seatText: {
    fontSize: 16,
    color: '#333',
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2a4759',
    borderRadius: 5,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TableListModal;
