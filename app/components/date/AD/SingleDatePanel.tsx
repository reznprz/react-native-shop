import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  singleDate: Date;
  currentMonth: Date;
  calendarDays: Date[]; // 42 days
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (d: Date) => void;
};

export const SingleDatePanel: React.FC<Props> = ({
  singleDate,
  currentMonth,
  calendarDays,
  onPrevMonth,
  onNextMonth,
  onDayPress,
}) => {
  const monthLabel = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInCurrentMonth = (d: Date) =>
    d.getFullYear() === currentMonth.getFullYear() && d.getMonth() === currentMonth.getMonth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth}>
          <Text style={styles.navBtn}>{'‹'}</Text>
        </Pressable>

        <Text style={styles.headerText}>{monthLabel}</Text>

        <Pressable onPress={onNextMonth}>
          <Text style={styles.navBtn}>{'›'}</Text>
        </Pressable>
      </View>

      {/* Weekdays */}
      <View style={styles.weekRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {calendarDays.map((day, idx) => {
          const inMonth = isInCurrentMonth(day);
          const selected = isSameDay(day, singleDate);

          return (
            <Pressable
              key={idx}
              onPress={() => onDayPress(day)}
              style={[styles.cell, selected && styles.cellSelected, !inMonth && styles.cellMuted]}
            >
              <Text
                style={[
                  styles.cellText,
                  selected && styles.cellTextSelected,
                  !inMonth && styles.cellTextMuted,
                ]}
              >
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  navBtn: { fontSize: 22, fontWeight: '700', paddingHorizontal: 12 },
  headerText: { fontSize: 16, fontWeight: '700' },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  weekDay: { width: '14.28%', textAlign: 'center', fontWeight: '600', color: '#666' },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },

  cell: {
    width: '14.28%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  cellSelected: { backgroundColor: '#2A4759', borderRadius: 6 },
  cellMuted: { opacity: 0.45 },

  cellText: { fontSize: 14 },
  cellTextSelected: { color: '#FFF', fontWeight: '700' },
  cellTextMuted: { color: '#333' },
});
