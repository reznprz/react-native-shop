import React from 'react';
import { Platform, Pressable, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BaseModal from './BaseModal';

interface DateModalProps {
  isVisible: boolean;
  date: Date;
  onConfirm: (selectedDate: string) => void;
  onCancel: () => void;
  headerTitle?: string;
}

const DateModal: React.FC<DateModalProps> = ({
  isVisible,
  date,
  onConfirm,
  onCancel,
  headerTitle = 'Select a Date',
}) => {
  // For web, use a native input within your BaseModal
  const handleMobileConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString();
    onConfirm(formattedDate);
  };

  const handleWebDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onConfirm(event.target.value);
  };

  if (Platform.OS !== 'web') {
    return (
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        date={date}
        onConfirm={handleMobileConfirm}
        onCancel={onCancel}
        themeVariant="light" // Force light theme if needed
      />
    );
  } else {
    return (
      <BaseModal
        visible={isVisible}
        onRequestClose={onCancel}
        headerTitle={headerTitle}
        body={
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={handleWebDateChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#2A4759]"
          />
        }
        footer={
          <Pressable onPress={onCancel} className="bg-[#2A4759] px-4 py-2 rounded-md">
            <Text className="text-white text-base font-semibold">Cancel</Text>
          </Pressable>
        }
      />
    );
  }
};

export default DateModal;
