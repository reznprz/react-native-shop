import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';

interface CategoryDropdownProps {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1 mt-4 md:mt-0">
      {/* Label */}
      <Text className="text-sm font-medium text-gray-700 mb-1">Category*</Text>

      {/* Pressable “input” */}
      <Pressable
        className={[
          'h-12 rounded-lg border border-gray-300 bg-gray-50 px-2 justify-center',
          open && 'border-deepTeal',
        ].join(' ')}
        onPress={() => setOpen((o) => !o)}
        android_ripple={{ color: '#E5E7EB' }} // ripple feedback on Android
      >
        <Text className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected || 'Select a category'}
        </Text>
      </Pressable>

      {/* Dropdown list */}
      {open && (
        <View
          className="
          absolute
          top-16
          left-0
          right-0
          bg-white
          border
          border-gray-200
          rounded-lg
          shadow-lg
          overflow-hidden
          z-10
        "
        >
          <ScrollView nestedScrollEnabled className="max-h-60">
            {categories.map((item) => (
              <Pressable
                key={item}
                className="px-4 py-3"
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                android_ripple={{ color: '#E5E7EB' }}
              >
                <Text className="text-gray-800">{item}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
