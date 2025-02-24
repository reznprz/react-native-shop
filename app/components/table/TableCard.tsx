import React, { useState } from 'react';
import { View, Text, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusChip } from '../common/StatusChip';
import { ActionsMenu } from '../common/ActionsMenu';

type TableCardProps = {
  name: string;
  status: string;
  seats: number;
  items: number;
  onGoToMenu: () => void;
  onGoToCart: () => void;
  onSwitchTable: () => void;
};

export function TableCard({
  name,
  status,
  seats,
  items,
  onGoToMenu,
  onGoToCart,
  onSwitchTable,
}: TableCardProps) {
  const [showActions, setShowActions] = useState(false);

  // Hide ActionsMenu when clicking outside
  const handlePressOutside = () => {
    if (showActions) {
      setShowActions(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePressOutside}
      accessible={false}
      touchSoundDisabled={true}
      onPressIn={() => Keyboard.dismiss()} // Dismiss keyboard in case of active input
    >
      <View className="relative bg-white rounded-xl shadow-md p-4 my-2 mx-2 w-58 flex-row justify-between">
        {/* Left Column - Table Name, Status, and Items */}
        <View className="flex flex-col justify-between">
          {/* Table Name & Status */}
          <Text className="text-lg font-semibold pb-2">{name}</Text>

          <Text className="text-base font-bold text-gray-700 ">Seats: {seats}</Text>

          {/* Items Count */}
          <Text className="text-gray-600 mt-4">Items: {items}</Text>
        </View>

        {/* Right Column - Seats and Arrow Button */}
        <View className="flex flex-col justify-between items-end">
          {/* Seats Count (Top Right) */}
          <View className="ml-3">
            <StatusChip status={status} />
          </View>

          {/* Arrow Icon Button (Bottom Right) */}
          <Pressable onPress={() => setShowActions(!showActions)} className="mt-auto">
            <Ionicons name="chevron-forward-outline" size={25} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Conditional Actions Menu */}
        {showActions && (
          <ActionsMenu
            onGoToMenu={onGoToMenu}
            onGoToCart={onGoToCart}
            onSwitchTable={onSwitchTable}
            onClose={() => setShowActions(false)}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
