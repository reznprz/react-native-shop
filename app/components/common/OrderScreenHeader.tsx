import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BaseModal from './modal/BaseModal';
import CustomIcon from './CustomIcon';
import { FilterStatus } from '../filter/filter';
import FilterHeader from '../filter/FilterHeader';

type OrderScreenHeaderProps = {
  selectedDate: string;
  orderStatuses: FilterStatus[];
  paymentStatuses: FilterStatus[];
  orderTypes: FilterStatus[];
  paymentMethods: FilterStatus[];
  onDateChange: (date: string) => void;
  onFilterPress?: () => void;
  onRemoveFilter: (label: string) => void;
  onOverflowPress: () => void;
};

const OrderScreenHeader: React.FC<OrderScreenHeaderProps> = ({
  selectedDate,
  orderStatuses = [],
  paymentStatuses = [],
  orderTypes = [],
  paymentMethods = [],
  onDateChange,
  onFilterPress,
  onRemoveFilter,
  onOverflowPress,
}) => {
  const [isMobileDatePickerVisible, setMobileDatePickerVisibility] = useState(false);
  const [isWebModalVisible, setWebModalVisible] = useState(false);

  // Combine all filters into one array
  const combinedFilters = useMemo(() => {
    const statues = [...orderStatuses, ...paymentStatuses, ...orderTypes, ...paymentMethods];
    return statues.filter((f) => f.isSelected);
  }, [orderStatuses, paymentStatuses, orderTypes, paymentMethods]);

  // Ensure a valid date
  const getPickerDate = () => {
    const parsed = new Date(selectedDate);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const showDatePicker = () => {
    if (Platform.OS === 'web') {
      setWebModalVisible(true);
    } else {
      setMobileDatePickerVisibility(true);
    }
  };

  const hideMobileDatePicker = () => setMobileDatePickerVisibility(false);
  const hideWebModal = () => setWebModalVisible(false);

  const handleMobileConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd
    onDateChange(formattedDate);
    hideMobileDatePicker();
  };

  const handleWebDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value);
    hideWebModal();
  };

  return (
    <View>
      {/* 1) Top row with date selection & filter button */}
      <View className="flex-row justify-between items-center bg-white p-3 rounded-lg border border-gray-200 mb-2">
        {/* Date Selection */}
        <TouchableOpacity
          onPress={showDatePicker}
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-md border border-gray-300"
        >
          <View className="flex-row items-center gap-2">
            <FontAwesome5 name="calendar-alt" size={16} color="gray" />
            <Text className="text-gray-600 font-semibold">{selectedDate}</Text>
            <FontAwesome5 name="chevron-down" size={12} color="gray" />
          </View>
        </TouchableOpacity>

        {/* Filter Button */}
        <View className="flex-row items-center justify-end">
          {combinedFilters.length > 0 ? (
            <Pressable onPress={onFilterPress}>
              <CustomIcon name="filter" size={20} color="#2A4759" type="Fontisto" />
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={onFilterPress}
                className="bg-[#2A4759] px-4 py-2 rounded-md border border-[#2A4759]"
                style={({ pressed }) => pressed && styles.pressedFilter}
              >
                <View className="flex-row items-center gap-2">
                  <CustomIcon name="filter" size={16} color="#fff" type="Fontisto" />
                  <Text className="text-white text-base">Filters</Text>
                </View>
              </Pressable>
            </>
          )}

          <FilterHeader
            filters={combinedFilters}
            onRemoveFilter={onRemoveFilter}
            onOverflowPress={onOverflowPress}
          />
        </View>
      </View>

      {/* Mobile Date Picker */}
      {Platform.OS !== 'web' && (
        <DateTimePickerModal
          isVisible={isMobileDatePickerVisible}
          mode="date"
          date={getPickerDate()}
          onConfirm={handleMobileConfirm}
          onCancel={hideMobileDatePicker}
          themeVariant="light" // Force light theme on iOS
        />
      )}

      {/* Web Date Picker */}
      {Platform.OS === 'web' && (
        <BaseModal
          visible={isWebModalVisible}
          onRequestClose={hideWebModal}
          headerTitle="Select a Date"
          body={
            <input
              type="date"
              value={getPickerDate().toISOString().split('T')[0]}
              onChange={handleWebDateChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#2A4759]"
            />
          }
          footer={
            <Pressable onPress={hideWebModal} className="bg-[#2A4759] px-4 py-2 rounded-md">
              <Text className="text-white text-base font-semibold">Cancel</Text>
            </Pressable>
          }
        />
      )}
    </View>
  );
};

export default OrderScreenHeader;

const styles = StyleSheet.create({
  pressedFilter: {
    transform: [{ scale: 0.97 }],
  },
});
