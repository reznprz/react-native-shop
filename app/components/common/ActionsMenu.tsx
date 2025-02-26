import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from './button/CustomButton';

type ActionsMenuProps = {
  onGoToMenu: () => void;
  onGoToCart: () => void;
  onSwitchTable: () => void;
  onClose: () => void;
};

export function ActionsMenu({ onGoToMenu, onGoToCart, onSwitchTable, onClose }: ActionsMenuProps) {
  return (
    <View
      className="absolute right-[4] top-[4] bg-white border border-gray-200 rounded-md shadow-md p-2 w-36"
      style={{ overflow: 'visible', zIndex: 9999, elevation: 9999 }}
    >
      {/* Close Button */}
      <Pressable onPress={onClose} className="flex flex-row justify-end pb-1">
        <Ionicons name="close-outline" size={20} color="black" />
      </Pressable>

      {/* Go to Menu */}
      <CustomButton
        title="Go to Menu"
        onPress={onGoToMenu}
        iconName="book-outline"
        customButtonStyle="flex-row items-center mb-2 rounded"
        customTextStyle="text-sm"
        bgColor="bg-warmSoftOrange"
      />

      {/* Go to Cart */}
      <CustomButton
        title="Go to Cart"
        onPress={onGoToCart}
        iconName="book-outline"
        customButtonStyle="flex-row items-center mb-2 rounded"
        customTextStyle="text-sm"
        bgColor="bg-darkTeal"
      />

      {/* Switch Table */}
      <CustomButton
        title="Switch Table"
        onPress={onSwitchTable}
        iconName="swap-horizontal-outline"
        customButtonStyle="flex-row items-center mb-1 rounded"
        customTextStyle="text-sm"
        bgColor="bg-roseBorder"
      />
    </View>
  );
}
