import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  currentMonth: Date;
  calendarDays: Date[]; // 42 days
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (d: Date) => void;
  isInSelectedRange: (d: Date) => boolean;
};

export const DateRangePanel: React.FC<Props> = ({
  currentMonth,
  calendarDays,
  onPrevMonth,
  onNextMonth,
  onDayPress,
  isInSelectedRange,
}) => {
  const monthLabel = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

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
          const inRange = isInSelectedRange(day);

          return (
            <Pressable
              key={idx}
              onPress={() => onDayPress(day)}
              style={[styles.cell, inRange && styles.inRange, !inMonth && styles.cellMuted]}
            >
              <Text style={[styles.cellText, !inMonth && styles.cellTextMuted]}>
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* NOTE: no extra bottom labels/summary (keeps modal height stable) */}
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

  inRange: { backgroundColor: '#D6E3EA', borderRadius: 6 },

  cellMuted: { opacity: 0.45 },
  cellText: { fontSize: 14 },
  cellTextMuted: { color: '#333' },
});
