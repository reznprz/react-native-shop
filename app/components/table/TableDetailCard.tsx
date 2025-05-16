import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { RestaurantTableInfo } from 'app/api/services/tableService';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';

interface TableDetailCardProps {
  table: RestaurantTableInfo;
  onUpdate: (table: RestaurantTableInfo) => void;
  onDelete: () => void;
}

const ITEM_HEIGHT = 70; // fixed height for each card
const SWIPE_WIDTH = 180; // total width for 2 buttons @ 70px each

const TableDetailCard: React.FC<TableDetailCardProps> = ({ table, onUpdate, onDelete }) => {
  return (
    /**
     * SwipeRow manages a single "front" view (rowFront)
     * and a single "back" view (rowBack) behind it.
     * rightOpenValue = -SWIPE_WIDTH => user can swipe left by 140px
     */
    // @ts-ignore - swipe-row children type mismatch
    <SwipeRow
      rightOpenValue={-SWIPE_WIDTH}
      disableLeftSwipe={false} // allow swiping left
      disableRightSwipe={true} // disallow swiping right (optional)
    >
      {/* Hidden back view: shows Update & Delete when swiped left */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: '#2a4759' }]}
          onPress={() => {
            onUpdate(table);
          }}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'red' }]}
          onPress={onDelete}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View className="p-2">
        <View className="flex flex-row items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <View className="flex flex-row items-center space-x-4">
            {/* Optional: Add an icon or avatar here if needed */}
            <View>
              <Text className="text-lg font-semibold text-gray-900">{table.tableName}</Text>
              <Text className="text-sm text-gray-500">{`Capacity: ${table.capacity}`}</Text>
            </View>
          </View>
        </View>
      </View>
    </SwipeRow>
  );
};

export default TableDetailCard;

const styles = StyleSheet.create({
  /** The hidden (back) row revealed when swiping left */
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: ITEM_HEIGHT,
    marginRight: 8,
    marginTop: 4,
  },
  backButton: {
    width: SWIPE_WIDTH / 2, // 70
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 8,
  },
  updateButton: {
    width: SWIPE_WIDTH / 2,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    marginTop: 4,
  },
});
