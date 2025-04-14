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
              activeOpacity={0.6}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 8,
    zIndex: 9999,
    elevation: 10,
    // Subtle shadow for a raised look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
  },
});
