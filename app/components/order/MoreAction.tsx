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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 28,
        margin: 12,
        height: 50,
      }}
    >
      {showAddFoodButton && (
        <View style={{ flex: 1 }}>
          <CustomButton title="Switch Table" onPress={onSwitchTable} textStyle={{ fontSize: 20 }} />
        </View>
      )}
      {showAddFoodButton && (
        <View style={{ flex: 1 }}>
          <CustomButton
            title="Add Food Items"
            onPress={onAddFoodItems}
            textStyle={{ fontSize: 20 }}
          />
        </View>
      )}
      {showCancelOrderButton && (
        <View style={{ flex: 1 }}>
          <LoadingButton
            title="Cancel Order"
            onPress={onCancelOrder}
            buttonState={canceledOrderState}
            textStyle={{ fontSize: 20 }}
          />
        </View>
      )}
    </View>
  );
};

export default MoreActions;
