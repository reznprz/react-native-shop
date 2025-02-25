import React, { useState } from 'react';
import { View, Text, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusChip } from '../common/StatusChip';
import { ActionsMenu } from '../common/ActionsMenu';
import { FontAwesome5 } from '@expo/vector-icons';
import IconLabel from '../common/IconLabel';

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
          <View className="flex-row items-center mb-2">
            <View className={`w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center`}>
              <FontAwesome5 name="table" size={14} color={'3B82F6'} />
            </View>
            <Text className={`font-semibold ml-2 text-gray-700`}>{name}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <View className={`w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center`}>
              <FontAwesome5 name="chair" size={14} color={'3B82F6'} />
            </View>
            <Text className={`font-semibold ml-2 text-gray-700`}>{`Seats: ${seats}`}</Text>
          </View>

          {/* Items Count */}
          <IconLabel label={`Items: ${items}`} iconName="utensils" iconColor="" />
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
