import React from 'react';
import { View, Text } from 'react-native';
import EmptyState from '../common/EmptyState';
import IconLabel from '../common/IconLabel';
import CustomButton from '../common/button/CustomButton';
import { TableItem as TableItems } from 'app/hooks/useTables';
import { OrderItem } from 'app/api/services/orderService';
import TableFoodItemCard from './TableFoodItemCard';
import CustomIcon from '../common/CustomIcon';
import { useTheme } from 'app/hooks/useTheme';

interface TableFoodItemsSummaryProps {
  tableItems: TableItems;
  updateQuantity: (food: OrderItem, newQuantity: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
}

const TableFoodItemsSummary: React.FC<TableFoodItemsSummaryProps> = ({
  tableItems,
  updateQuantity,
  onSwitchTableClick,
}) => {
  const theme = useTheme();

  return (
    <View className="bg-white p-4 rounded-lg ">
      {/* Order Header Info */}
      <View className="bg-white rounded-lg flex-row items-center justify-between">
        {/* Left Section: Order Info */}
        <View className="gap-1">
          <IconLabel
            iconName="clipboard-list"
            label={`Order #${tableItems.id}`}
            bgColor={theme.quaternary}
          />
          <IconLabel
            iconName="table"
            label={'Table:'}
            subLabel={tableItems.tableName}
            bgColor={theme.quaternary}
          />

          <Text className="text-gray-600 pb-4">
            {'User:'} <Text className="font-semibold">{tableItems.userId}</Text>
          </Text>

          <IconLabel
            iconName="clock"
            iconType={'FontAwesome5'}
            iconSize={18}
            label={`${tableItems.date}`}
            applyCircularIconBg={false}
            labelTextSize={'ml-2 text-base'}
            bgColor={theme.quaternary}
          />
        </View>

        {/* Right Section: Date */}
        <View className="flex flex-col gap-16 items-center justify-between">
          {onSwitchTableClick && (
            <CustomButton
              title="Switch Table"
              onPress={() => {
                onSwitchTableClick('');
              }}
              iconName="swap-horizontal-outline"
              customButtonStyle="flex flex-row items-center justify-center rounded px-1 py-2 w-36 h-30 bg-deepTeal m-1"
              customTextStyle="text-md text-center text-white font-semibold"
            />
          )}

          {tableItems.orderMenuType && tableItems.orderMenuType === 'TOURIST' && (
            <CustomIcon
              type="Ionicons"
              name="earth-outline"
              size={20}
              iconStyle="text-black-200 pr-1 pl-4"
              color="#2a4759"
            />
          )}

          {/* <Text className="text-gray-700 font-medium pb-4">{'📅 15 Jan 2025'}</Text> */}
        </View>
      </View>
      {/* Divider */}
      <View className="w-full h-px bg-gray-200 my-3" />
      {!tableItems || tableItems.orderItems.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please add items to the Customer table."
          iconSize={80}
        />
      ) : (
        tableItems.orderItems.map((item) => (
          <TableFoodItemCard
            key={item.id + item.productName}
            item={item}
            updateQuantity={updateQuantity}
          />
        ))
      )}
    </View>
  );
};

export default TableFoodItemsSummary;
