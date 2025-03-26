import React from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { atMidnight } from './utils';

type SingleDatePanelProps = {
  singleDate: Date;
  currentMonth: Date;
  calendarDays: Date[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (day: Date) => void;
};

export const SingleDatePanel: React.FC<SingleDatePanelProps> = ({
  singleDate,
  currentMonth,
  calendarDays,
  onPrevMonth,
  onNextMonth,
  onDayPress,
}) => {
  return (
    <View style={styles.subTabContent}>
      <Text style={styles.instructions}>Select a single date below:</Text>
      <View style={styles.monthNav}>
        <Pressable onPress={onPrevMonth} style={styles.navBtn}>
          <FontAwesome5 name="chevron-left" size={14} color="#333" />
        </Pressable>
        <Text style={styles.monthText}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable onPress={onNextMonth} style={styles.navBtn}>
          <FontAwesome5 name="chevron-right" size={14} color="#333" />
        </Pressable>
      </View>
      <View style={styles.weekdaysRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <Text key={d} style={styles.weekdayText}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, idx) => {
          const dayAtMidnight = atMidnight(day);
          const isInMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = dayAtMidnight.getTime() === singleDate.getTime();

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onDayPress(day)}
              style={[
                styles.dayContainer,
                !isInMonth && styles.outsideMonth,
                isSelected && styles.selectedDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  !isInMonth && styles.outsideMonthText,
                  isSelected && styles.selectedDayText,
                ]}
              >
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  navBtn: {
    padding: 6,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  weekdayText: {
    width: 30,
    textAlign: 'center',
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayContainer: {
    width: '13%',
    aspectRatio: 1,
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  outsideMonth: {
    backgroundColor: 'transparent',
  },
  outsideMonthText: {
    color: '#AAA',
  },
  selectedDay: {
    backgroundColor: '#2A4759',
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
