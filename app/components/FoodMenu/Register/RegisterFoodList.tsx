import React from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { Food } from 'app/api/services/foodService';
import { OrderItem } from 'app/api/services/orderService';
import RegisterFoodCard from './RegisterFoodCard';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { TableItem } from 'app/hooks/useTables';

interface Props {
  foods: Food[];
  selectedSubTab: string;
  tableItems: TableItem;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
}

const RegisterFoodList: React.FC<Props> = ({
  foods,
  selectedSubTab,
  tableItems,
  updateCartItemForFood,
}) => {
  const { numColumnsRegisterScreen } = useIsDesktop();

  return (
    <FlatList
      data={foods}
      numColumns={numColumnsRegisterScreen}
      key={numColumnsRegisterScreen}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <RegisterFoodCard
          food={item}
          tableItem={tableItems.orderItems.find((tableItem) => tableItem.productName === item.name)}
          selectedSubTab={selectedSubTab}
          updateCartItemForFood={updateCartItemForFood}
          numColumnsRegisterScreen={numColumnsRegisterScreen}
        />
      )}
    />
  );
};

export default RegisterFoodList;

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
