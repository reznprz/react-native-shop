import { OrderItem } from 'app/api/services/orderService';
import EmptyState from 'app/components/common/EmptyState';
import IconLabel from 'app/components/common/IconLabel';
import TableFoodItemCard from 'app/components/table/TableFoodItemCard';
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

interface RegisterOrderItemsSummaryProps {
  orderId: string;
  items: OrderItem[];
  updateQuantity: (item: OrderItem, newQuantity: number) => void;
}

const RegisterOrderItemsSummary: React.FC<RegisterOrderItemsSummaryProps> = ({
  orderId,
  items,
  updateQuantity,
}) => {
  const theme = useTheme();

  return (
    <View className="mb-4 bg-gray-100 p-4 rounded-lg mt-2">
      <IconLabel iconName="receipt" label={`Order Summary ${orderId}`} bgColor={theme.quaternary} />
      {items.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please add items to the Customer table."
          iconSize={40}
        />
      ) : (
        items.map((item, index) => (
          <TableFoodItemCard
            key={item.id + item.productName}
            item={item}
            updateQuantity={updateQuantity}
            hideIcon={true}
            smallText={true}
            itemHeight={50}
          />
        ))
      )}
    </View>
  );
};

export default RegisterOrderItemsSummary;
