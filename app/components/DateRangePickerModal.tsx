import React, { useState, useMemo } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { QuickRangePanel } from './date/QuickRangePanel';
import { TimeRangeTodayPanel } from './date/TimeRangeTodayPanel';
import { SingleDatePanel } from './date/SingleDatePanel';
import { DateRangePanel } from './date/DateRangePanel';
import {
  atMidnight,
  DateRangeSelection,
  DateRangeSelectionType,
  QuickRangeItem,
  QuickRangePayload,
} from './date/utils';

// --------------------------------------------------
// Custom Hook: useDateRangePickerLogic
// Encapsulates state & logic for all date range modes
// --------------------------------------------------
function useDateRangePickerLogic() {
  // Which sub-tab is active
  const [activeSubTab, setActiveSubTab] = useState<DateRangeSelectionType>(
    DateRangeSelectionType.TIME_RANGE_TODAY,
  );

  // QUICK RANGE
  const [activeQuickRange, setActiveQuickRange] = useState<QuickRangePayload | null>(null);

  // TIME RANGE (TODAY)
  const [todayStartHour, setTodayStartHour] = useState(0);
  const [todayStartMin, setTodayStartMin] = useState(0);
  const [todayEndHour, setTodayEndHour] = useState(1);
  const [todayEndMin, setTodayEndMin] = useState(0);

  // SINGLE DATE
  const [singleDate, setSingleDate] = useState<Date>(atMidnight(new Date()));

  // DATE RANGE
  const [startDateRange, setStartDateRange] = useState<Date>(atMidnight(new Date()));
  const [endDateRange, setEndDateRange] = useState<Date>(atMidnight(new Date()));
  // "2-click approach" for selecting date ranges
  const [rangeClicks, setRangeClicks] = useState(0);

  // Shared calendar state (for SINGLE_DATE & DATE_RANGE)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  /** Switch sub-tab => reset relevant states. */
  const handleSubTabChange = (newTab: DateRangeSelectionType) => {
    setActiveSubTab(newTab);

    // Reset states for whichever sub-tab is selected
    switch (newTab) {
      case DateRangeSelectionType.QUICK_RANGE:
        setActiveQuickRange(null);
        break;
      case DateRangeSelectionType.TIME_RANGE_TODAY:
        setTodayStartHour(0);
        setTodayStartMin(0);
        setTodayEndHour(1);
        setTodayEndMin(0);
        break;
      case DateRangeSelectionType.SINGLE_DATE:
        setSingleDate(atMidnight(new Date()));
        break;
      case DateRangeSelectionType.DATE_RANGE:
        setStartDateRange(atMidnight(new Date()));
        setEndDateRange(atMidnight(new Date()));
        setRangeClicks(0);
        break;
    }
  };

  /** QUICK RANGES => set the active quick range. */
  const handleQuickRange = (label: string, unit?: 'minutes' | 'days', value?: number) => {
    setActiveQuickRange({ label, unit, value });
    setActiveSubTab(DateRangeSelectionType.QUICK_RANGE);
  };

  /** Calendar month nav => next/previous month. */
  const nextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };
  const prevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  /** Build array of 42 days for the displayed month (Mon-Sun layout). */
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const dayOfWeek = firstOfMonth.getDay(); // 0 = Sunday, ... 6 = Saturday
    // shift so Monday is day 0
    const offset = (dayOfWeek + 6) % 7;

    const start = new Date(firstOfMonth);
    start.setDate(start.getDate() - offset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  /** SINGLE_DATE => one-click picks that date. */
  const selectSingleDate = (clicked: Date) => {
    setSingleDate(clicked);
  };

  /**
   * DATE_RANGE => 2-click approach:
   *  1st click: set startDate/endDate = clicked
   *  2nd click: set endDate = clicked; if clicked < start => swap
   *  3rd click: reset & treat it as new start
   */
  const handleDateRangeClick = (clicked: Date) => {
    if (rangeClicks === 0) {
      setStartDateRange(clicked);
      setEndDateRange(clicked);
      setRangeClicks(1);
    } else if (rangeClicks === 1) {
      // second click
      if (clicked.getTime() < startDateRange.getTime()) {
        setEndDateRange(startDateRange);
        setStartDateRange(clicked);
      } else {
        setEndDateRange(clicked);
      }
      setRangeClicks(2);
    } else {
      // third click => reset
      setStartDateRange(clicked);
      setEndDateRange(clicked);
      setRangeClicks(1);
    }
  };

  /** Check if a day is in the selected [startDate, endDate]. */
  const isInSelectedRange = (day: Date) => {
    const t = day.getTime();
    const s = startDateRange.getTime();
    const e = endDateRange.getTime();
    return t >= Math.min(s, e) && t <= Math.max(s, e);
  };

  /** Main day-press handler => depends on sub-tab. */
  const handleDayPress = (day: Date) => {
    const clickedMidnight = atMidnight(day);

    if (activeSubTab === DateRangeSelectionType.SINGLE_DATE) {
      selectSingleDate(clickedMidnight);
    } else if (activeSubTab === DateRangeSelectionType.DATE_RANGE) {
      handleDateRangeClick(clickedMidnight);
    }
  };

  return {
    // States
    activeSubTab,
    activeQuickRange,
    todayStartHour,
    todayStartMin,
    todayEndHour,
    todayEndMin,
    singleDate,
    startDateRange,
    endDateRange,
    currentMonth,
    calendarDays,

    // Handlers
    handleSubTabChange,
    handleQuickRange,
    setTodayStartHour,
    setTodayStartMin,
    setTodayEndHour,
    setTodayEndMin,
    prevMonth,
    nextMonth,
    handleDayPress,
    isInSelectedRange,
  };
}

type DateRangePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (result: DateRangeSelection) => void;
  quickRanges?: QuickRangeItem[];
  enabledSubTabs?: DateRangeSelectionType[];
};

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  visible,
  onClose,
  onApply,
  quickRanges = [
    { label: 'Past 15 Mins', unit: 'minutes', value: 15 },
    { label: 'Past 30 Mins', unit: 'minutes', value: 30 },
    { label: 'Past 1 Hour', unit: 'minutes', value: 60 },
    { label: 'Past 2 Hours', unit: 'minutes', value: 120 },
    { label: 'Today', unit: 'days', value: 1 },
    { label: 'Last 7 Days', unit: 'days', value: 7 },
    { label: 'Last 15 Days', unit: 'days', value: 15 },
    { label: 'Last 30 Days', unit: 'days', value: 30 },
  ],
  enabledSubTabs = [
    DateRangeSelectionType.TIME_RANGE_TODAY,
    DateRangeSelectionType.SINGLE_DATE,
    DateRangeSelectionType.DATE_RANGE,
  ],
}) => {
  const {
    activeSubTab,
    activeQuickRange,
    todayStartHour,
    todayStartMin,
    todayEndHour,
    todayEndMin,
    singleDate,
    startDateRange,
    endDateRange,
    currentMonth,
    calendarDays,
    handleSubTabChange,
    handleQuickRange,
    setTodayStartHour,
    setTodayStartMin,
    setTodayEndHour,
    setTodayEndMin,
    prevMonth,
    nextMonth,
    handleDayPress,
    isInSelectedRange,
  } = useDateRangePickerLogic();

  const handleApply = () => {
    let result: DateRangeSelection;
    switch (activeSubTab) {
      case DateRangeSelectionType.QUICK_RANGE: {
        // If a quickRange is actually selected, use that; otherwise, send a fallback
        if (activeQuickRange) {
          result = {
            selectionType: DateRangeSelectionType.QUICK_RANGE,
            quickRange: activeQuickRange,
          };
        } else {
          result = {
            selectionType: DateRangeSelectionType.QUICK_RANGE,
            quickRange: { label: 'Unknown' },
          };
        }
        break;
      }
      case DateRangeSelectionType.TIME_RANGE_TODAY: {
        result = {
          selectionType: DateRangeSelectionType.TIME_RANGE_TODAY,
          startHour: todayStartHour,
          startMin: todayStartMin,
          endHour: todayEndHour,
          endMin: todayEndMin,
        };
        break;
      }
      case DateRangeSelectionType.SINGLE_DATE: {
        result = {
          selectionType: DateRangeSelectionType.SINGLE_DATE,
          date: singleDate.toISOString().split('T')[0],
        };
        break;
      }
      case DateRangeSelectionType.DATE_RANGE:
      default: {
        result = {
          selectionType: DateRangeSelectionType.DATE_RANGE,
          startDate: startDateRange.toISOString().split('T')[0],
          endDate: endDateRange.toISOString().split('T')[0],
        };
        break;
      }
    }
    onApply(result);
  };

  const displayedSubTabs = enabledSubTabs || [
    DateRangeSelectionType.TIME_RANGE_TODAY,
    DateRangeSelectionType.SINGLE_DATE,
    DateRangeSelectionType.DATE_RANGE,
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <View style={[styles.topRow, { minHeight: 500 }]}>
            {/* LEFT SIDEBAR: Quick Ranges (render only if we have quickRanges) */}
            {quickRanges && quickRanges.length > 0 && (
              <QuickRangePanel
                quickRanges={quickRanges}
                activeQuickRange={activeQuickRange}
                onSelectRange={handleQuickRange}
              />
            )}

            {/* RIGHT CONTENT: Sub-Tab Navigation & Panels */}
            <View style={styles.rightContainer}>
              <View style={styles.subTabRow}>
                {displayedSubTabs.map((subTabType) => {
                  let label = '';
                  switch (subTabType) {
                    case DateRangeSelectionType.TIME_RANGE_TODAY:
                      label = 'Time Range (Today)';
                      break;
                    case DateRangeSelectionType.SINGLE_DATE:
                      label = 'Specific Date';
                      break;
                    case DateRangeSelectionType.DATE_RANGE:
                      label = 'Date Range';
                      break;
                    case DateRangeSelectionType.QUICK_RANGE:
                      label = 'Quick Range';
                      break;
                    default:
                      label = 'Unknown';
                  }

                  return (
                    <Pressable
                      key={subTabType}
                      onPress={() => handleSubTabChange(subTabType)}
                      style={[
                        styles.subTabBtn,
                        activeSubTab === subTabType && styles.subTabBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.subTabBtnText,
                          activeSubTab === subTabType && styles.subTabBtnTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ flex: 1, minHeight: 300 }}>
                {/* TIME RANGE (TODAY) */}
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

                {/* SINGLE DATE PICKER */}
                {activeSubTab === DateRangeSelectionType.SINGLE_DATE &&
                  displayedSubTabs.includes(DateRangeSelectionType.SINGLE_DATE) && (
                    <SingleDatePanel
                      singleDate={singleDate}
                      currentMonth={currentMonth}
                      calendarDays={calendarDays}
                      onPrevMonth={prevMonth}
                      onNextMonth={nextMonth}
                      onDayPress={handleDayPress}
                    />
                  )}

                {/* DATE RANGE PICKER */}
                {activeSubTab === DateRangeSelectionType.DATE_RANGE &&
                  displayedSubTabs.includes(DateRangeSelectionType.DATE_RANGE) && (
                    <DateRangePanel
                      currentMonth={currentMonth}
                      calendarDays={calendarDays}
                      onPrevMonth={prevMonth}
                      onNextMonth={nextMonth}
                      onDayPress={handleDayPress}
                      isInSelectedRange={isInSelectedRange}
                    />
                  )}

                {/* QUICK RANGE tab (if you want a separate tab for it) */}
                {activeSubTab === DateRangeSelectionType.QUICK_RANGE &&
                  displayedSubTabs.includes(DateRangeSelectionType.QUICK_RANGE) && (
                    <View style={styles.subTabContent}>
                      <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        Please select a quick range from the left panel.
                      </Text>
                    </View>
                  )}
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={[styles.btn, styles.cancelBtn]}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={[styles.btn, styles.applyBtn]}>
              <Text style={styles.btnText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Platform.OS === 'web' ? 800 : '90%',
    maxWidth: 820,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
  },
  rightContainer: {
    flex: 1,
    padding: 12,
  },
  subTabRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  subTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  subTabBtnActive: {
    backgroundColor: '#2A4759',
  },
  subTabBtnText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  subTabBtnTextActive: {
    color: '#FFF',
  },
  subTabContent: {
    backgroundColor: '#F4F6F8',
    padding: 10,
    borderRadius: 4,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopColor: '#DDD',
    borderTopWidth: 1,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 4,
    marginLeft: 10,
  },
  btnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#777',
  },
  applyBtn: {
    backgroundColor: '#2A4759',
  },
});

export default DateRangePickerModal;
