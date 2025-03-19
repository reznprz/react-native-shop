import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DateModal from './modal/DateModal';

interface DatePickerFieldProps {
  label?: string;
  date: string;
  onChange: (date: string) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ label, date, onChange }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate: string) => {
    onChange(selectedDate);
    hidePicker();
  };

  const getPickerDate = () => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return (
    <View className="mb-3">
      {label && <Text className="mb-1 text-lg text-gray-800">{label}</Text>}
      <Pressable
        onPress={showPicker}
        className="bg-gray-100 rounded-md py-3 px-3 border border-gray-300"
      >
        <Text className="text-gray-700">{getPickerDate().toLocaleString()}</Text>
      </Pressable>
      <DateModal
        isVisible={isPickerVisible}
        date={getPickerDate()}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        headerTitle="Select a Date"
      />
    </View>
  );
};

export default DatePickerField;
