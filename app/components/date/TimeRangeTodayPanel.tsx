import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type TimeRangeTodayPanelProps = {
  todayStartHour: number;
  todayStartMin: number;
  todayEndHour: number;
  todayEndMin: number;
  setTodayStartHour: React.Dispatch<React.SetStateAction<number>>;
  setTodayStartMin: React.Dispatch<React.SetStateAction<number>>;
  setTodayEndHour: React.Dispatch<React.SetStateAction<number>>;
  setTodayEndMin: React.Dispatch<React.SetStateAction<number>>;
};

export const TimeRangeTodayPanel: React.FC<TimeRangeTodayPanelProps> = ({
  todayStartHour,
  todayStartMin,
  todayEndHour,
  todayEndMin,
  setTodayStartHour,
  setTodayStartMin,
  setTodayEndHour,
  setTodayEndMin,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 500;

  return (
    <View style={styles.subTabContent}>
      <Text style={styles.instructions}>Select a start & end time for today:</Text>
      <View style={[styles.timeRangeContainer, { flexDirection: isMobile ? 'column' : 'row' }]}>
        {/* Start Time */}
        <View style={[styles.timeColumn, { width: isMobile ? '100%' : '48%' }]}>
          <Text style={styles.timeColumnTitle}>Start Time</Text>
          <View style={styles.timePickerRow}>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayStartHour((h) => Math.max(h - 1, 0))}
            >
              <FontAwesome5 name="chevron-left" size={14} color="#333" />
            </Pressable>
            <Text style={styles.timeValue}>{String(todayStartHour).padStart(2, '0')}h</Text>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayStartHour((h) => Math.min(h + 1, 23))}
            >
              <FontAwesome5 name="chevron-right" size={14} color="#333" />
            </Pressable>
          </View>
          <View style={styles.timePickerRow}>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayStartMin((m) => (m === 0 ? 59 : m - 1))}
            >
              <FontAwesome5 name="chevron-left" size={14} color="#333" />
            </Pressable>
            <Text style={styles.timeValue}>{String(todayStartMin).padStart(2, '0')}m</Text>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayStartMin((m) => (m === 59 ? 0 : m + 1))}
            >
              <FontAwesome5 name="chevron-right" size={14} color="#333" />
            </Pressable>
          </View>
        </View>

        {/* End Time */}
        <View style={[styles.timeColumn, { width: isMobile ? '100%' : '48%' }]}>
          <Text style={styles.timeColumnTitle}>End Time</Text>
          <View style={styles.timePickerRow}>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayEndHour((h) => Math.max(h - 1, 0))}
            >
              <FontAwesome5 name="chevron-left" size={14} color="#333" />
            </Pressable>
            <Text style={styles.timeValue}>{String(todayEndHour).padStart(2, '0')}h</Text>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayEndHour((h) => Math.min(h + 1, 23))}
            >
              <FontAwesome5 name="chevron-right" size={14} color="#333" />
            </Pressable>
          </View>
          <View style={styles.timePickerRow}>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayEndMin((m) => (m === 0 ? 59 : m - 1))}
            >
              <FontAwesome5 name="chevron-left" size={14} color="#333" />
            </Pressable>
            <Text style={styles.timeValue}>{String(todayEndMin).padStart(2, '0')}m</Text>
            <Pressable
              style={styles.timeArrowBtn}
              onPress={() => setTodayEndMin((m) => (m === 59 ? 0 : m + 1))}
            >
              <FontAwesome5 name="chevron-right" size={14} color="#333" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subTabContent: {
    backgroundColor: '#F4F6F8',
    padding: 10,
    borderRadius: 4,
    flex: 1,
  },
  instructions: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  timeRangeContainer: {
    justifyContent: 'space-between',
  },
  timeColumn: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeColumnTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'center',
  },
  timeArrowBtn: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    color: '#111827',
    minWidth: 50,
    textAlign: 'center',
    fontWeight: '500',
  },
});
