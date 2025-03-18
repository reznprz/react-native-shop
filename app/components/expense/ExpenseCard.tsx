import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';

interface ExpenseCardProps {
  title: string;
  date: string;
  amount: number;
  quantity: number;
  icon: React.ReactNode;
  iconBgColor?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ITEM_HEIGHT = 80; // fixed height for each card
const SWIPE_WIDTH = 180; // total width for 2 buttons @ 70px each

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  title,
  date,
  amount,
  quantity,
  icon,
  iconBgColor = 'bg-blue-400',
  onUpdate,
  onDelete,
}) => {
  console.log(iconBgColor);
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
          style={[styles.backButton, { backgroundColor: '#2a4759' }]}
          onPress={onUpdate}
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

      {/* Visible front view: the card content itself */}
      <View
        className={`flex-row justify-between items-center p-5 bg-white border-b border-gray-200 `}
      >
        <View className="flex-row items-center">
          <View className={`p-3  rounded-md mr-3`} style={{ backgroundColor: iconBgColor }}>
            {icon}
          </View>
          <View>
            <Text className="text-gray-800 font-semibold">{title}</Text>
            <Text className="text-gray-600">{date}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-gray-800 font-semibold">रु {amount.toFixed(2)}</Text>
          <Text className="text-gray-600 text-sm">Qty: {quantity} items</Text>
        </View>
      </View>
    </SwipeRow>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  /** The hidden (back) row revealed when swiping left */
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: ITEM_HEIGHT,
  },
  backButton: {
    width: SWIPE_WIDTH / 2, // 70
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    marginTop: 4,
  },
});

/** The visible (front) row */
// rowFront: {
//     height: ITEM_HEIGHT,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
