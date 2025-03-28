import { OrderItem } from 'app/api/services/orderService';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomIcon from '../common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import { useDebouncedQuantity } from 'app/hooks/useDebouncedQuantity';
import { SwipeRow } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';

const FALLBACK_IMAGE_URI = 'https://picsum.photos/300/200';

interface TableFoodItemCardProps {
  item: OrderItem;
  updateQuantity: (item: OrderItem, newQuantity: number) => void;
}

const ITEM_HEIGHT = 90;
const SWIPE_WIDTH = 90;

const TableFoodItemCard: React.FC<TableFoodItemCardProps> = ({ item, updateQuantity }) => {
  const { tempQuantity, handleIncrement, handleDecrement } = useDebouncedQuantity(
    item?.quantity ?? 0,
    (newQty) => updateQuantity(item, newQty),
  );

  return (
    // @ts-ignore
    <SwipeRow rightOpenValue={-SWIPE_WIDTH} disableLeftSwipe={false} disableRightSwipe={true}>
      {/* Hidden back view */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'red' }]}
          onPress={() => updateQuantity(item, 0)}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Front view (card) */}
      <View style={styles.cardContainer}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.iconMetadata?.bgColor || '#3498db' },
          ]}
        >
          <CustomIcon
            name={item.iconMetadata?.iconName || ''}
            type={(item.iconMetadata?.iconType as IconType) || 'Feather'}
            size={22}
            color={item.iconMetadata?.filledColor}
            validate={true}
          />
        </View>

        {/* Info section */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>
          <Text style={styles.unitPrice}>${item.unitPrice.toFixed(2)}</Text>
        </View>

        {/* Quantity + Total Price */}
        <View style={styles.actionContainer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity onPress={handleDecrement} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.qtyDisplay}>
              <Text style={styles.qtyText}>{tempQuantity}</Text>
            </View>
            <TouchableOpacity onPress={handleIncrement} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceText}>
              ${`${(item.unitPrice * item.quantity).toFixed(2)}`}
            </Text>
          </View>
        </View>
      </View>
    </SwipeRow>
  );
};

export default TableFoodItemCard;

const styles = StyleSheet.create({
  /** Swipe hidden back view */
  rowBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 6,
    marginVertical: 4,
  },
  backButton: {
    width: SWIPE_WIDTH,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 2,
  },

  /** Front card container */
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    zIndex: 1,
    marginVertical: 4,
    marginHorizontal: 6,
  },

  /** Icon container */
  iconContainer: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  /** Product info */
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#184E57',
  },
  unitPrice: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  /** Quantity control + price */
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#184E57',
  },
  qtyDisplay: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  qtyText: {
    fontSize: 14,
    color: '#184E57',
  },

  /** Fixed-width price */
  totalPriceContainer: {
    width: 75,
    alignItems: 'flex-end',
  },
  totalPriceText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#184E57',
  },
});
