import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DateRangeSelectionType } from '../utils';

import { TimeRangeTodayPanel } from './TimeRangeTodayPanel';
import { SingleDatePanel } from './SingleDatePanel';
import { DateRangePanel } from './DateRangePanel';

type Props = {
  activeSubTab: DateRangeSelectionType;
  displayedSubTabs: DateRangeSelectionType[];

  todayStartHour: number;
  todayStartMin: number;
  todayEndHour: number;
  todayEndMin: number;

  setTodayStartHour: (v: number) => void;
  setTodayStartMin: (v: number) => void;
  setTodayEndHour: (v: number) => void;
  setTodayEndMin: (v: number) => void;

  singleDate: Date;
  currentMonth: Date;
  calendarDays: Date[];

  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (d: Date) => void;

  startDateRange: Date;
  endDateRange: Date;
  isInSelectedRange: (d: Date) => boolean;
};

export const ADDatePicker: React.FC<Props> = ({
  activeSubTab,
  displayedSubTabs,
  todayStartHour,
  todayStartMin,
  todayEndHour,
  todayEndMin,
  setTodayStartHour,
  setTodayStartMin,
  setTodayEndHour,
  setTodayEndMin,
  singleDate,
  currentMonth,
  calendarDays,
  onPrevMonth,
  onNextMonth,
  onDayPress,
  isInSelectedRange,
}) => {
  return (
    <View style={{ flex: 1, minHeight: 300 }}>
      {activeSubTab === DateRangeSelectionType.TIME_RANGE_TODAY &&
        displayedSubTabs.includes(DateRangeSelectionType.TIME_RANGE_TODAY) && (
          <TimeRangeTodayPanel
            todayStartHour={todayStartHour}
            todayStartMin={todayStartMin}
            todayEndHour={todayEndHour}
            todayEndMin={todayEndMin}
            setTodayStartHour={setTodayStartHour}
            setTodayStartMin={setTodayStartMin}
            setTodayEndHour={setTodayEndHour}
            setTodayEndMin={setTodayEndMin}
          />
        )}

      {activeSubTab === DateRangeSelectionType.SINGLE_DATE &&
        displayedSubTabs.includes(DateRangeSelectionType.SINGLE_DATE) && (
          <SingleDatePanel
            singleDate={singleDate}
            currentMonth={currentMonth}
            calendarDays={calendarDays}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onDayPress={onDayPress}
          />
        )}

      {activeSubTab === DateRangeSelectionType.DATE_RANGE &&
        displayedSubTabs.includes(DateRangeSelectionType.DATE_RANGE) && (
          <DateRangePanel
            currentMonth={currentMonth}
            calendarDays={calendarDays}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onDayPress={onDayPress}
            isInSelectedRange={isInSelectedRange}
          />
        )}

      {activeSubTab === DateRangeSelectionType.QUICK_RANGE &&
        displayedSubTabs.includes(DateRangeSelectionType.QUICK_RANGE) && (
          <View style={styles.subTabContent}>
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Please select a quick range from the left panel.
            </Text>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  subTabContent: { backgroundColor: '#F4F6F8', padding: 10, borderRadius: 4, flex: 1 },
});
