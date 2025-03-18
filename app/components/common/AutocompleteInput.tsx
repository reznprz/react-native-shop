import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Enter text',
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleTextChange = (text: string) => {
    onChange(text);
    if (text.length > 0) {
      const filtered = options.filter((item) => item.toLowerCase().startsWith(text.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
  };

  return (
    <View style={styles.autocompleteContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSuggestionPress(suggestion)}
              style={styles.suggestionItem}
            >
              <Text>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default AutocompleteInput;

const styles = StyleSheet.create({
  autocompleteContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50, // adjust based on your input's height
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopWidth: 0,
    // Ensure it appears on top:
    zIndex: 9999, // iOS
    elevation: 10, // Android
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
