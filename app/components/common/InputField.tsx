import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

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
  }) => {
    const theme = useTheme();

    return (
      <View className="mb-4">
        <Text className="mb-1 text-base font-medium" style={{ color: theme.textSecondary }}>
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          autoCapitalize="none"
          placeholderTextColor={theme.textTertiary}
          style={{
            backgroundColor: theme.primaryBg,
            borderColor: theme.icon,
            color: theme.textSecondary,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            fontSize: 16,
          }}
        />
      </View>
    );
  },
);

export default InputField;
