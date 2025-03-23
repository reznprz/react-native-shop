import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';

interface ExpenseItem {
  key: string; // required by SwipeListView
  title: string;
  date: string;
  amount: number;
  quantity: number;
}

// A functional component that renders all expenses in a swipeable list
const ExpenseListScreen = () => {
  // Dummy expense data
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      key: '1',
      title: 'Groceries',
      date: '2025-03-17',
      amount: 249.5,
      quantity: 5,
    },
    {
      key: '2',
      title: 'Electric Bill',
      date: '2025-03-15',
      amount: 1200.0,
      quantity: 1,
    },
    {
      key: '3',
      title: 'Restaurant',
      date: '2025-03-14',
      amount: 560.0,
      quantity: 3,
    },
  ]);

  // Called when the user taps "Update"
  const handleUpdate = (rowKey: string) => {
    console.log('Update pressed for: ', rowKey);
    // e.g., navigate to an edit screen or show a modal
  };

  // Called when the user taps "Delete"
  const handleDelete = (rowKey: string) => {
    // Remove from state
    setExpenses((prev) => prev.filter((item) => item.key !== rowKey));
  };

  /**
   * Renders the visible “front” view of the row
   * (your expense card content).
   */
  const renderItem = (data: { item: ExpenseItem }) => {
    const { title, date, amount, quantity } = data.item;
    return (
      <View style={styles.rowFront}>
        {/* Left part: icon or label */}
        <View style={styles.rowLeft}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="shopping-cart" size={24} color="#333" />
          </View>
          <View>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>
        {/* Right part: amount + quantity */}
        <View style={styles.rowRight}>
          <Text style={styles.amountText}>रु {amount.toFixed(2)}</Text>
          <Text style={styles.qtyText}>Qty: {quantity} items</Text>
        </View>
      </View>
    );
  };

  /**
   * Renders the “hidden” view behind the row
   * (the Update/Delete buttons).
   */
  const renderHiddenItem = (data: { item: ExpenseItem }) => {
    const rowKey = data.item.key;
    return (
      <View style={styles.rowBack}>
        {/* Update Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: '#FFA500' }]}
          onPress={() => handleUpdate(rowKey)}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.backButtonText}>Update</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'red' }]}
          onPress={() => handleDelete(rowKey)}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.backButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SwipeListView
        data={expenses}
        renderItem={renderItem} // Visible front
        renderHiddenItem={renderHiddenItem} // Hidden back
        /**
         * Swiping left => we open "rightOpenValue".
         * This negative value means how far the row slides to the left.
         * We have 2 buttons (70px each) => 140 => -140
         */
        rightOpenValue={-140}
        previewRowKey="1" // Optionally highlight row #1 first
        previewOpenValue={-40} // how far to open for preview
        previewOpenDelay={1000} // delay before preview
        disableRightSwipe // if you only want left swipes
      />
    </View>
  );
};

export default ExpenseListScreen;

/** Styles */
const styles = StyleSheet.create({
  // The visible row
  rowFront: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 80,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  // The hidden row (behind the front)
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', // place the buttons on the right side
    height: 80,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  iconContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    color: '#666',
  },
  amountText: {
    fontWeight: '600',
    color: '#333',
  },
  qtyText: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    width: 70,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    marginTop: 4,
  },
});
