import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  isDesktop: boolean;
  searchTerm: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isDesktop, searchTerm, onSearch }) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.searchContainer, isDesktop ? styles.desktop : styles.mobile]}>
        <Ionicons name="search" size={20} color="gray" />

        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          value={searchTerm}
          onChangeText={onSearch}
          style={[styles.textInput, isDesktop ? styles.desktopInput : styles.mobileInput]}
        />

        {searchTerm?.length > 0 && (
          <TouchableOpacity onPress={() => onSearch('')}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  desktop: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: '100%',
    flex: 1,
  },
  mobile: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: 220,
    width: '100%',
  },
  textInput: {
    marginLeft: 8,
    flex: 1,
    padding: 0,
    color: '#333',
  } as TextStyle,
  desktopInput: {
    fontSize: 16,
  } as TextStyle,
  mobileInput: {
    fontSize: 14,
  } as TextStyle,
});
