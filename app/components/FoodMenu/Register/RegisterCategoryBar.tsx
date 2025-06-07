import CustomIcon from 'app/components/common/CustomIcon';
import { getFilterIcon } from 'app/hooks/utils/getFilterIcon';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';

interface RegisterCategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryClick: (selectedCategory: string) => void;
}

const RegisterCategoryBar: React.FC<RegisterCategoryBarProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.buttonContainer}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const { iconName, iconType } = getFilterIcon('Categories', cat);

          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.button,
                isSelected && styles.buttonSelected,
                Platform.OS === 'web' && styles.webButton,
              ]}
              onPress={() => {
                onCategoryClick(cat);
              }}
              activeOpacity={0.8}
            >
              <CustomIcon
                type={iconType}
                name={iconName}
                size={12}
                color={isSelected ? '#fff' : '#2a4759'}
              />
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default RegisterCategoryBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    zIndex: 100,
    elevation: 4,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    maxHeight: '100%',
  },
  buttonContainer: {
    alignItems: 'flex-start',
  },
  button: {
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#e1e6ea',
    borderRadius: 6,
    width: '100%',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  buttonSelected: {
    backgroundColor: '#2a4759',
  },
  buttonText: {
    marginTop: 4,
    color: '#2a4759',
    fontSize: 9,
    fontWeight: '600',
  },
  buttonTextSelected: {
    color: '#ffffff',
  },
  webButton: {
    // Platform-specific styling for web, if needed
  },
});
