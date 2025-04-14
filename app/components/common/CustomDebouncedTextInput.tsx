import React, { useState, useRef, useEffect } from 'react';
import { TextInput, KeyboardTypeOptions, TextInputProps } from 'react-native';

interface CustomDebouncedTextInputProps {
  value: string;
  onDebouncedChange: (text: string) => void;
  debounceDelay?: number;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: TextInputProps['style'];
  className?: string;
}

const CustomDebouncedTextInput: React.FC<CustomDebouncedTextInputProps> = ({
  value,
  onDebouncedChange,
  debounceDelay = 800,
  placeholder,
  keyboardType,
  style,
  className,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceTimeout = useRef<number | null>(null);

  // Update local state when the external value changes.
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (text: string) => {
    setInputValue(text);
    // Clear any existing debounce timer
    if (debounceTimeout.current !== null) {
      clearTimeout(debounceTimeout.current);
    }
    // Set a new debounce timer
    debounceTimeout.current = setTimeout(() => {
      onDebouncedChange(text);
      console.log('Debounced input:', text);
    }, debounceDelay) as unknown as number;
  };

  return (
    <TextInput
      placeholder={placeholder}
      value={inputValue}
      onChangeText={handleChange}
      keyboardType={keyboardType}
      style={style}
      className={className}
    />
  );
};

export default CustomDebouncedTextInput;
