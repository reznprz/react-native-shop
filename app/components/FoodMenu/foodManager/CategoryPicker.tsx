import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const CategoryPicker: React.FC<Props> = ({ categories, selected, onSelect }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>Category*</Text>
    <View style={styles.container}>
      <Picker
        selectedValue={selected}
        onValueChange={onSelect}
        mode="dropdown"
        dropdownIconColor="#94a3b8"
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {categories.map((c) => (
          <Picker.Item key={c} label={c} value={c} />
        ))}
      </Picker>
    </View>
  </View>
);

export default CategoryPicker;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 16, // md:mt-0 / mt-4 equivalent
  },
  label: {
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    color: '#374151', // text-gray-700
    marginBottom: 4, // mb-1
  },
  container: {
    height: 48, // h-12
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    borderRadius: 8, // rounded-lg
    backgroundColor: '#F9FAFB', // bg-gray-50
    justifyContent: 'center',
    paddingHorizontal: 8, // px-2
  },
  picker: {
    width: '100%',
    // Android: text color
    ...(Platform.OS === 'android' ? { color: '#0F172A' } : {}),
  },
  pickerItem:
    Platform.OS === 'ios'
      ? {
          // iOS wheel styling
          color: '#0F172A',
          fontSize: 16,
          height: 150,
        }
      : {},
});
