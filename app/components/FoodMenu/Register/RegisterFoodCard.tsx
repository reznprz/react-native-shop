import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Food } from 'app/api/services/foodService';
import { OrderItem } from 'app/api/services/orderService';
import { useDebouncedQuantity } from 'app/hooks/useDebouncedQuantity';
import CountChip from 'app/components/common/CountChip';

interface Props {
  food: Food;
  tableItem?: OrderItem;
  numColumnsRegisterScreen: number;
  selectedSubTab: string;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
}

const calcWidth = (cols: number): `${number}%` => `${(100 - 4) / cols}%` as `${number}%`;

const RegisterFoodCard: React.FC<Props> = ({
  food,
  tableItem,
  selectedSubTab,
  updateCartItemForFood,
  numColumnsRegisterScreen,
}) => {
  const boxDynamicStyle = useMemo<ViewStyle>(
    () => ({ width: calcWidth(numColumnsRegisterScreen) }),
    [numColumnsRegisterScreen],
  );

  const { tempQuantity, handleIncrement } = useDebouncedQuantity(
    tableItem?.quantity ?? 0,
    (newQty) => updateCartItemForFood(food, newQty),
  );

  const price = selectedSubTab === 'NORMAL' ? food.price : food.touristPrice;

  return (
    <TouchableOpacity
      style={[styles.card, boxDynamicStyle, tempQuantity > 0 && styles.activeCard]}
      onPress={handleIncrement}
      activeOpacity={0.7}
    >
      <View style={styles.cardInner}>
        {tempQuantity > 0 && <CountChip count={tempQuantity} style={styles.countChipPosition} />}
        <Text style={styles.name} numberOfLines={3}>
          {food.name}
        </Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RegisterFoodCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activeCard: {
    backgroundColor: '#d1e8f5',
  },
  cardInner: {
    position: 'relative', // needed to anchor the absolute CountChip
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2a4759',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  countChipPosition: {
    position: 'absolute',
    top: -4,
    right: -14,
  },
});
