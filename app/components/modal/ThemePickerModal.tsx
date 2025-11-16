import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BaseBottomSheetModal } from 'app/components/common/modal/BaseBottomSheetModal';
import { ThemeVariant } from 'app/theme/theme';
import { Feather } from '@expo/vector-icons';

type ThemePickerModalProps = {
  visible: boolean;
  currentVariant: ThemeVariant;
  onSelect: (variant: ThemeVariant) => void;
  onRequestClose: () => void;
};

const OPTION_META: { key: ThemeVariant; label: string; description: string; colors: string[] }[] = [
  {
    key: 'BLUE',
    label: 'Blue',
    description: 'Calm & modern (default)',
    colors: ['#2E3A47', '#2a4759', '#a0c4dc'],
  },
  {
    key: 'GREEN',
    label: 'Green',
    description: 'Fresh & organic',
    colors: ['#064E3B', '#047857', '#A7F3D0'],
  },
  {
    key: 'BROWN',
    label: 'Brown',
    description: 'Warm cafe style',
    colors: ['#4B2E21', '#7A4F34', '#F7F1E7'],
  },
];

const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  visible,
  currentVariant,
  onSelect,
  onRequestClose,
}) => {
  return (
    <BaseBottomSheetModal visible={visible} onClose={onRequestClose}>
      <View className="w-full pb-4">
        <Text className="text-lg font-bold text-gray-900 mb-2">Choose Theme Color</Text>
        <Text className="text-xs text-gray-500 mb-4">
          This controls header, buttons, and highlight colors for your restaurant.
        </Text>

        {OPTION_META.map((opt) => {
          const isActive = opt.key === currentVariant;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onSelect(opt.key)}
              className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-3 border ${
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <View>
                <Text className="text-sm font-semibold text-gray-900">{opt.label}</Text>
                <Text className="text-xs text-gray-500 mt-1">{opt.description}</Text>
              </View>

              <View className="flex-row items-center">
                {opt.colors.map((c, idx) => (
                  <View
                    key={`${opt.key}-${idx}`}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full ml-1"
                  />
                ))}
                {isActive && (
                  <Feather
                    name="check-circle"
                    size={18}
                    color="#2563EB"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseBottomSheetModal>
  );
};

export default ThemePickerModal;
