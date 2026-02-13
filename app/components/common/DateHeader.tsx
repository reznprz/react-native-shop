import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import BaseModal from './modal/BaseModal';
import { DateRangeSelection, DateRangeSelectionType, getDisplayDateRange } from '../date/utils';
import { DateRangePickerModal } from '../DateRangePickerModal';
import { AdaptiveDatePicker } from './AdaptiveDatePicker';

type DateHeaderProps = {
  selectedDate: string;
  activeTab: string;
  onDateChange: (date: string) => void;
  handleApplyDate: (selectedDateRange: DateRangeSelection) => void;
};

const DateHeader: React.FC<DateHeaderProps> = ({
  selectedDate,
  activeTab,
  onDateChange,
  handleApplyDate,
}) => {
  const [isMobileDatePickerVisible, setMobileDatePickerVisibility] = useState(false);
  const [isWebModalVisible, setWebModalVisible] = useState(false);
  const [isRangeModalVisible, setRangeModalVisible] = useState(false);
  const [displayDateRange, setDisplayDateRange] = useState('Last 7 Days');

  // Ensure a valid date
  const getPickerDate = () => {
    const parsed = new Date(selectedDate);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const showDatePicker = () => {
    if (activeTab === 'Past') {
      setRangeModalVisible(true);
    } else {
      if (Platform.OS === 'web') {
        setWebModalVisible(true);
      } else {
        setMobileDatePickerVisibility(true);
      }
    }
  };

  const handleDateRangeApply = (selection: DateRangeSelection) => {
    setRangeModalVisible(false);

    const label = getDisplayDateRange(selection);
    // for display
    setDisplayDateRange(label);

    // makes api call
    handleApplyDate(selection);
  };

  const hideMobileDatePicker = () => setMobileDatePickerVisibility(false);
  const hideWebModal = () => setWebModalVisible(false);

  const handleMobileConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
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
      <View className="flex-row justify-between items-center bg-white pl-3 pt-3 pb-3 rounded-lg border border-gray-200 mb-2">
        {/* Date Selection */}
        <TouchableOpacity
          onPress={showDatePicker}
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-md border border-gray-300"
        >
          <View className="flex-row items-center gap-2">
            <FontAwesome5 name="calendar-alt" size={16} color="gray" />
            <Text className="text-gray-600 font-semibold">
              {activeTab === 'Past' ? displayDateRange : selectedDate}
            </Text>
            <FontAwesome5 name="chevron-down" size={12} color="gray" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Mobile Date Picker */}
      {Platform.OS !== 'web' &&
        (console.log('Rendering DatePickerSheet with date:', getPickerDate()),
        (
          <AdaptiveDatePicker
            visible={isMobileDatePickerVisible}
            initialDate={getPickerDate()}
            onClose={hideMobileDatePicker}
            onConfirm={handleMobileConfirm}
            title="Select date"
          />
        ))}

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

      <DateRangePickerModal
        visible={isRangeModalVisible}
        onClose={() => setRangeModalVisible(false)}
        onApply={(selectedDateRange) => {
          handleDateRangeApply(selectedDateRange);
        }}
        quickRanges={[
          { label: 'Today', unit: 'days', value: 1 },
          { label: 'Last 2 Days', unit: 'days', value: 2 },
          { label: 'Last 7 Days', unit: 'days', value: 7 },
          { label: 'Last 14 Days', unit: 'days', value: 14 },
          { label: 'Last 15 Days', unit: 'days', value: 15 },
          { label: 'Last 30 Days', unit: 'days', value: 30 },
        ]}
        enabledSubTabs={[DateRangeSelectionType.SINGLE_DATE, DateRangeSelectionType.DATE_RANGE]}
      />
    </View>
  );
};

export default DateHeader;

const styles = StyleSheet.create({
  pressedFilter: {
    transform: [{ scale: 0.97 }],
  },
});
