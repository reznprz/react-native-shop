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
      <View className="bg-white p-4 gap-3 rounded-lg shadow-sm border border-gray-200 mb-2">
        {/* Top header name and status */}
        <View className="flex-row justify-between items-center">
          <IconLabel iconName="clipboard-list" label={name} containerStyle="justify-between" />
          <StatusChip status={status} />
        </View>

        {/* seat count */}
        <View className="flex-col justify-between">
          <IconLabel
            label={`Seats: ${seats}`}
            iconName="chair"
            containerStyle=""
            textColor="text-lg"
            labelTextSize="text-base pl-2"
          />
        </View>

        {/* footer items count and more action button */}
        <View className="flex-row justify-between items-center">
          <IconLabel
            iconName="utensils"
            label={`Items: ${items}`}
            containerStyle="justify-between"
          />
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
