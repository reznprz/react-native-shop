import React, { useState } from 'react';
import { View, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusChip } from '../common/StatusChip';
import { ActionsMenu } from '../common/ActionsMenu';
import IconLabel from '../common/IconLabel';
import { on } from 'events';
import { useTheme } from 'app/hooks/useTheme';

type TableCardProps = {
  name: string;
  status: string;
  seats: number;
  items: number;
  onGoToMenu?: () => void;
  onGoToCart?: () => void;
  onSwitchTable?: () => void;
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
  const theme = useTheme();

  const [showActions, setShowActions] = useState(false);

  // Hide ActionsMenu when clicking outside
  const handlePressOutside = () => {
    if (showActions) {
      setShowActions(false);
    }
    if (onGoToMenu) {
      onGoToMenu();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePressOutside}
      accessible={false}
      touchSoundDisabled={true}
      onPressIn={() => Keyboard.dismiss()} // Dismiss keyboard in case of active input
    >
      <View
        className="p-4 gap-3 rounded-lg shadow-sm border border-gray-200 mb-2"
        style={{ backgroundColor: theme.secondaryBg }}
      >
        {/* Top header name and status */}
        <View className="flex-row justify-between items-center ">
          <IconLabel
            iconName="clipboard-list"
            iconType={'TableIcon'}
            label={name}
            iconSize={24}
            containerStyle="justify-between"
            parentWidthHeight="w-12 h-12"
            bgColor={theme.quaternary}
          />
          <StatusChip status={status} />
        </View>

        {/* seat count */}
        <View className="flex-col justify-between">
          <IconLabel
            label={`Seats: ${seats}`}
            iconName="chair"
            containerStyle=""
            textColor="text-base"
            labelTextSize="text-base pl-2 text-gray-500"
            bgColor={theme.quaternary}
          />
        </View>

        {/* footer items count and more action button */}
        <View className="flex-row justify-between items-center">
          <IconLabel
            iconName="utensils"
            label={`Items: ${items}`}
            containerStyle="justify-between"
            labelTextSize="text-base pl-2 text-gray-500"
            bgColor={theme.quaternary}
          />
          {/* <Pressable onPress={() => setShowActions(!showActions)} className="mt-auto">
            <Ionicons name="chevron-forward-outline" size={25} color="#9CA3AF" />
          </Pressable> */}
        </View>
        {/* Conditional Actions Menu */}
        {showActions && onGoToMenu && onGoToCart && onSwitchTable && (
          <ActionsMenu
            onGoToMenu={() => {
              onGoToMenu();
              setShowActions(false);
            }}
            onGoToCart={onGoToCart}
            onSwitchTable={() => {
              onSwitchTable();
              setShowActions(false);
            }}
            onClose={() => setShowActions(false)}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
