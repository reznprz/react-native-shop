import { THEME_PRESETS, ThemeVariant } from 'app/theme/theme';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ThemeColorPickerProps {
  selected: ThemeVariant;
  onSelect: (variant: ThemeVariant) => void;
}

const ORDER: ThemeVariant[] = ['BLUE', 'GREEN', 'BROWN', 'SUNSET'];

const LABELS: Record<ThemeVariant, string> = {
  BLUE: 'Classic Blue',
  GREEN: 'Fresh Green',
  BROWN: 'Mocha Cafe',
  SUNSET: 'Sunset Glow',
  PURPLE: 'Purple ',
};

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ selected, onSelect }) => {
  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 mb-2">Theme</Text>

      <View style={styles.grid}>
        {ORDER.map((variant) => {
          const theme = THEME_PRESETS[variant];
          const isActive = selected === variant;

          return (
            <Pressable
              key={variant}
              onPress={() => onSelect(variant)}
              style={[
                styles.tile,
                {
                  borderColor: isActive ? theme.secondary : '#E5E7EB',
                  backgroundColor: '#ffffff',
                },
              ]}
            >
              <View style={styles.swatchRow}>
                <View style={[styles.swatch, { backgroundColor: theme.primary }]} />
                <View style={[styles.swatch, { backgroundColor: theme.secondary }]} />
                <View style={[styles.swatch, { backgroundColor: theme.tertiary }]} />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? '600' : '500',
                  color: '#111827',
                }}
              >
                {LABELS[variant]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default ThemeColorPicker;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tile: {
    width: '50%', // 2 columns
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  swatchRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  swatch: {
    flex: 1,
    height: 16,
    borderRadius: 6,
    marginRight: 4,
  },
});
