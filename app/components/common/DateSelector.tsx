import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type DateSelectorProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [isMobileDatePickerVisible, setMobileDatePickerVisibility] = useState(false);
  const [isWebModalVisible, setWebModalVisible] = useState(false);

  // Helper to ensure we always have a valid date.
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

  const hideMobileDatePicker = () => {
    setMobileDatePickerVisibility(false);
  };

  const hideWebModal = () => {
    setWebModalVisible(false);
  };

  const handleMobileConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format: yyyy-MM-dd
    onDateChange(formattedDate);
    hideMobileDatePicker();
  };

  const handleWebDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value);
    hideWebModal();
  };

  return (
    <View style={styles.container}>
      {/* Date Selection */}
      <TouchableOpacity onPress={showDatePicker} style={styles.dateContainer}>
        <FontAwesome5 name="calendar-alt" size={16} color="gray" />
        <Text style={styles.dateText}>{selectedDate}</Text>
        <FontAwesome5 name="chevron-down" size={12} color="gray" />
      </TouchableOpacity>

      {/* Filter Icon */}
      <TouchableOpacity>
        <FontAwesome5 name="sliders-h" size={18} color="gray" />
      </TouchableOpacity>

      {/* Mobile Date Picker Modal */}
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

      {/* Web Date Picker Modal */}
      {Platform.OS === 'web' && (
        <Modal
          visible={isWebModalVisible}
          transparent
          animationType="slide"
          onRequestClose={hideWebModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Date</Text>
              <input
                type="date"
                value={getPickerDate().toISOString().split('T')[0]}
                onChange={handleWebDateChange}
                style={styles.dateInput as React.CSSProperties} // Type assertion for web style
              />
              <Pressable onPress={hideWebModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: 'gray',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  dateInput: {
    padding: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default DateSelector;
