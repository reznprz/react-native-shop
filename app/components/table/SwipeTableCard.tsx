import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusChip } from '../common/StatusChip';
import { Ionicons } from '@expo/vector-icons';
import IconLabel from '../common/IconLabel';
import { SwipeRow } from 'react-native-swipe-list-view';

type SwipeTableCardProps = {
  name: string;
  status: string;
  seats: number;
  items: number;
  onGoToMenu: () => void;
  onGoToCart: () => void;
  onSwitchTable: () => void;
};

const ITEM_HEIGHT = 160; // fixed height for each card
const SWIPE_WIDTH = 120; // total width for 2 buttons @ 70px each

export function SwipeTableCard({
  name,
  status,
  seats,
  items,
  onGoToMenu,
  onGoToCart,
  onSwitchTable,
}: SwipeTableCardProps) {
  return (
    // @ts-ignore - swipe-row children type mismatch
    <SwipeRow rightOpenValue={-SWIPE_WIDTH} disableLeftSwipe={false} disableRightSwipe={true}>
      {/* Hidden back view: shows Update & Delete when swiped left */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: '#2a4759' }]}
          onPress={onGoToMenu}
        >
          <Ionicons name="fast-food" size={32} color="#FFF" />
          <Text style={styles.buttonText}>GotoMenu</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-4 gap-3 rounded-lg shadow-sm border border-gray-200 mb-2">
        {/* Top header name and status */}
        <View className="flex-row justify-between items-center ">
          <IconLabel
            iconName="clipboard-list"
            iconType={'TableIcon'}
            label={name}
            iconSize={24}
            containerStyle="justify-between"
            parentWidthHeight="w-12 h-12"
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
          />
        </View>

        {/* footer items count and more action button */}
        <View className="flex-row justify-between items-center">
          <IconLabel
            iconName="utensils"
            label={`Items: ${items}`}
            containerStyle="justify-between"
            labelTextSize="text-base pl-2 text-gray-500"
          />
        </View>
      </View>
    </SwipeRow>
  );
}

const styles = StyleSheet.create({
  /** The hidden (back) row revealed when swiping left */
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: ITEM_HEIGHT,
  },
  backButton: {
    width: SWIPE_WIDTH,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    marginTop: 4,
  },
});
