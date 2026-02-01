import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DateRangeSelectionType } from '../utils';
import { TimeRangeTodayPanel } from '../AD/TimeRangeTodayPanel';

import { BsSingleDatePanel } from './BsSingleDatePanel';
import { BsDateRangePanel } from './BsDateRangePanel';
import { BsMonthPanel } from './BsMonthPanel';

export type BsDate = { year: number; month: number; day: number };
export type BsMonth = { year: number; month: number };

type Props = {
  activeSubTab: DateRangeSelectionType;
  displayedSubTabs: DateRangeSelectionType[];
  isMonthTab: boolean;

  // Time Range Today (shared parent state)
  todayStartHour: number;
  todayStartMin: number;
  todayEndHour: number;
  todayEndMin: number;
  setTodayStartHour: (v: number) => void;
  setTodayStartMin: (v: number) => void;
  setTodayEndHour: (v: number) => void;
  setTodayEndMin: (v: number) => void;

  // BS Specific Date
  singleBsDate: BsDate;
  setSingleBsDate: (d: BsDate) => void;

  // BS Date Range
  startBsRange: BsDate;
  endBsRange: BsDate;
  bsRangeClicks: number;
  setStartBsRange: (d: BsDate) => void;
  setEndBsRange: (d: BsDate) => void;
  setBsRangeClicks: (n: number) => void;

  // BS Month nav for calendar panels
  currentBsMonth: BsMonth;
  onPrevBsMonth: () => void;
  onNextBsMonth: () => void;

  // Month selection
  selectedBsMonth: BsMonth;
  setSelectedBsMonth: (m: BsMonth) => void;
};

export const BSDatePicker: React.FC<Props> = (props) => {
  const {
    activeSubTab,
    displayedSubTabs,
    isMonthTab,

    todayStartHour,
    todayStartMin,
    todayEndHour,
    todayEndMin,
    setTodayStartHour,
    setTodayStartMin,
    setTodayEndHour,
    setTodayEndMin,

    singleBsDate,
    setSingleBsDate,

    startBsRange,
    endBsRange,
    bsRangeClicks,
    setStartBsRange,
    setEndBsRange,
    setBsRangeClicks,

    currentBsMonth,
    onPrevBsMonth,
    onNextBsMonth,

    selectedBsMonth,
    setSelectedBsMonth,
  } = props;

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
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

      {!isMonthTab &&
        activeSubTab === DateRangeSelectionType.SINGLE_DATE &&
        displayedSubTabs.includes(DateRangeSelectionType.SINGLE_DATE) && (
          <BsSingleDatePanel
            selected={singleBsDate}
            currentMonth={currentBsMonth}
            onPrevMonth={onPrevBsMonth}
            onNextMonth={onNextBsMonth}
            onSelect={setSingleBsDate}
          />
        )}

      {!isMonthTab &&
        activeSubTab === DateRangeSelectionType.DATE_RANGE &&
        displayedSubTabs.includes(DateRangeSelectionType.DATE_RANGE) && (
          <BsDateRangePanel
            start={startBsRange}
            end={endBsRange}
            clicks={bsRangeClicks}
            setClicks={setBsRangeClicks}
            setStart={setStartBsRange}
            setEnd={setEndBsRange}
            currentMonth={currentBsMonth}
            onPrevMonth={onPrevBsMonth}
            onNextMonth={onNextBsMonth}
          />
        )}

      {isMonthTab && (
        <BsMonthPanel
          year={selectedBsMonth.year}
          selectedMonth={selectedBsMonth.month}
          onYearChange={(year) => setSelectedBsMonth({ year, month: selectedBsMonth.month })}
          onSelectMonth={(month) => setSelectedBsMonth({ year: selectedBsMonth.year, month })}
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
