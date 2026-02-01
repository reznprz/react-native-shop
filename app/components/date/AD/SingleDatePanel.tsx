import { useTheme } from 'app/hooks/useTheme';
import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { makeCalendarStyles } from '../common/ad-calendar-ui';

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
  const theme = useTheme();
  const styles = useMemo(() => makeCalendarStyles(theme), [theme]);

  const monthLabel = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInCurrentMonth = (d: Date) =>
    d.getFullYear() === currentMonth.getFullYear() && d.getMonth() === currentMonth.getMonth();

  return (
    <View style={styles.panel}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} style={styles.navBtn}>
          <Text style={styles.navIcon}>{'‹'}</Text>
        </Pressable>

        <Text style={styles.headerText}>{monthLabel}</Text>

        <Pressable onPress={onNextMonth} style={styles.navBtn}>
          <Text style={styles.navIcon}>{'›'}</Text>
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
              style={[
                styles.cell,
                styles.pressable,
                selected && styles.selected,
                !inMonth && styles.muted,
              ]}
            >
              <Text style={[styles.textStrong, selected && styles.textOnPrimary]}>
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
