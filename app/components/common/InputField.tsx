import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    maxLength,
  }) => (
    <View className="mb-4">
      <Text className="mb-1 text-base text-gray-800">{label}</Text>
      <TextInput
        className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
    </View>
  ),
);

export default InputField;
