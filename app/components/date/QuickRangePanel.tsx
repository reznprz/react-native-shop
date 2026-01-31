import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuickRangePayload } from './utils';

interface QuickRangeItem {
  label: string;
  unit?: 'minutes' | 'days';
  value?: number;
}

type QuickRangePanelProps = {
  quickRanges: QuickRangeItem[];
  activeQuickRange: QuickRangePayload | null;
  onSelectRange: (label: string, unit?: 'minutes' | 'days', value?: number) => void;
};

export const QuickRangePanel: React.FC<QuickRangePanelProps> = ({
  quickRanges,
  activeQuickRange,
  onSelectRange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Ranges</Text>
      {quickRanges.map((qr, idx) => {
        const isActive = activeQuickRange?.label === qr.label;
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.presetBtn, isActive && styles.activePresetBtn]}
            onPress={() => onSelectRange(qr.label, qr.unit, qr.value)}
          >
            <Text style={[styles.presetBtnText, isActive && styles.activePresetBtnText]}>
              {qr.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECF1F5',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#D8D8D8',
    minWidth: 140,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4759',
    marginBottom: 12,
  },
  presetBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  presetBtnText: {
    fontSize: 14,
    color: '#2A4759',
  },
  activePresetBtn: {
    backgroundColor: '#2A4759',
    borderColor: '#2A4759',
  },
  activePresetBtnText: {
    color: '#FFFFFF',
  },
});
