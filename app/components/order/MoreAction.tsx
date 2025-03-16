import React from 'react';
import { View } from 'react-native';
import CustomButton from 'app/components/common/button/CustomButton';
import LoadingButton, { ButtonState } from '../common/button/LoadingButton';

interface MoreActionsProps {
  showAddFoodButton?: boolean;
  showCancelOrderButton?: boolean;
  canceledOrderState: ButtonState;
  onSwitchTable: () => void;
  onAddFoodItems: () => void;
  onCancelOrder: () => void;
}

const MoreActions: React.FC<MoreActionsProps> = ({
  showAddFoodButton = false,
  showCancelOrderButton = false,
  canceledOrderState,
  onSwitchTable,
  onAddFoodItems,
  onCancelOrder,
}) => {
  return (
    <View className="flex-row justify-around items-center p-4 m-4">
      {showAddFoodButton && (
        <CustomButton
          title="Switch Table"
          onPress={onSwitchTable}
          customButtonStyle="w-1/2 mr-2 flex items-center justify-center rounded-lg px-4 py-4 bg-[#2a4759] shadow-md"
          textSize="text-lg font-semibold text-white"
        />
      )}
      {showAddFoodButton && (
        <CustomButton
          title="Add Food Items"
          onPress={onAddFoodItems}
          customButtonStyle="w-1/2 ml-2 flex items-center justify-center rounded-lg px-5 py-4 bg-[#2a4759] shadow-md"
          textSize="text-lg font-semibold text-white"
        />
      )}
      {showCancelOrderButton && (
        <LoadingButton
          title="Cancel Order"
          onPress={onCancelOrder}
          buttonState={canceledOrderState}
          bgColor="bg-red-800"
          width="xl"
          height="xl"
          textSize="text-2xl font-semibold text-white"
        />
      )}
    </View>
  );
};

export default MoreActions;
