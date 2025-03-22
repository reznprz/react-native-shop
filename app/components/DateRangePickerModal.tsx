import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export enum DateRangeSelectionType {
  QUICK_RANGE = 'QUICK_RANGE',
  TIME_RANGE_TODAY = 'TIME_RANGE_TODAY',
  SINGLE_DATE = 'SINGLE_DATE',
  DATE_RANGE = 'DATE_RANGE',
}

/**
 * For Quick Ranges, we just send label + optional numeric value and a unit
 * (like minutes or days). The backend can interpret them.
 */
interface QuickRangePayload {
  label: string; // e.g. "Past 15 Mins" or "Last 7 Days"
  unit?: 'minutes' | 'days';
  value?: number; // e.g. 15, 7, etc.
}

/**
 * The final data structure returned to the parent on "Apply."
 * We do NOT do date/time conversions for QUICK_RANGE on the front end.
 */
export type DateRangeSelection =
  | {
      selectionType: DateRangeSelectionType.QUICK_RANGE;
      quickRange: QuickRangePayload;
    }
  | {
      selectionType: DateRangeSelectionType.TIME_RANGE_TODAY;
      startHour: number;
      startMin: number;
      endHour: number;
      endMin: number;
    }
  | {
      selectionType: DateRangeSelectionType.SINGLE_DATE;
      date: string;
    }
  | {
      selectionType: DateRangeSelectionType.DATE_RANGE;
      startDate: string;
      endDate: string;
    };

/** Utility: zero out hour, min, sec for a date. */
function atMidnight(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * A custom hook that encapsulates most of the date-range logic.
 * You can then use this inside your modal component.
 */
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
  // We track how many clicks so far in DATE_RANGE sub-tab (for the “2-click approach”).
  const [rangeClicks, setRangeClicks] = useState(0);

  // CALENDAR (shared among SINGLE_DATE and DATE_RANGE)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  /** Switch sub-tab => reset relevant states. */
  const handleSubTabChange = (newTab: DateRangeSelectionType) => {
    setActiveSubTab(newTab);

    // Also reset any states for that sub-tab
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

  /** QUICK RANGES */
  const handleQuickRange = (label: string, unit?: 'minutes' | 'days', value?: number) => {
    setActiveQuickRange({ label, unit, value });
    setActiveSubTab(DateRangeSelectionType.QUICK_RANGE);
  };

  /** CALENDAR MONTH NAV */
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
    const dayOfWeek = firstOfMonth.getDay(); // 0=Sun,...6=Sat
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

  /** SINGLE_DATE => just pick that date. */
  const selectSingleDate = (clicked: Date) => {
    setSingleDate(clicked);
  };

  /**
   * DATE_RANGE => 2-click approach:
   *  - 1st click: set startDate/endDate = clicked
   *  - 2nd click: set endDate = clicked; if clicked < start => swap
   *  - 3rd click: reset & treat it as new start
   */
  const handleDateRangeClick = (clicked: Date) => {
    if (rangeClicks === 0) {
      setStartDateRange(clicked);
      setEndDateRange(clicked);
      setRangeClicks(1);
    } else if (rangeClicks === 1) {
      // second click
      if (clicked.getTime() < startDateRange.getTime()) {
        // swap
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

  /** Check if a day is in the [startDate, endDate] range. */
  const isInSelectedRange = (day: Date) => {
    const t = day.getTime();
    const s = startDateRange.getTime();
    const e = endDateRange.getTime();
    return t >= Math.min(s, e) && t <= Math.max(s, e);
  };

  /**
   * The "day press" for the calendar depends on the sub-tab.
   */
  const handleDayPress = (day: Date) => {
    const selected = atMidnight(day);

    if (activeSubTab === DateRangeSelectionType.SINGLE_DATE) {
      selectSingleDate(selected);
    } else if (activeSubTab === DateRangeSelectionType.DATE_RANGE) {
      handleDateRangeClick(selected);
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

/**
 * The main Modal component that uses the hook above.
 */
type DateRangePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (result: DateRangeSelection) => void;
};

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  // Use the custom hook for logic
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

  /** BUILD THE RESULT on "Apply" */
  const handleApply = () => {
    let result: DateRangeSelection;
    switch (activeSubTab) {
      case DateRangeSelectionType.QUICK_RANGE: {
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

  // For consistent sizing
  const screenWidth = Dimensions.get('window').width;
  const leftColWidth = screenWidth < 500 ? 130 : 160;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {/* We set a bigger minHeight so the footer doesn't overlap. */}
          <View style={[styles.topRow, { minHeight: 500 }]}>
            {/* LEFT SIDEBAR - QUICK RANGES */}
            <View style={[styles.leftColumn, { width: leftColWidth }]}>
              <Text style={styles.sectionTitle}>Quick Ranges</Text>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Past 15 Mins' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Past 15 Mins', 'minutes', 15)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Past 15 Mins' && styles.activePresetBtnText,
                  ]}
                >
                  Past 15 Mins
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Past 30 Mins' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Past 30 Mins', 'minutes', 30)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Past 30 Mins' && styles.activePresetBtnText,
                  ]}
                >
                  Past 30 Mins
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Past 1 Hour' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Past 1 Hour', 'minutes', 60)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Past 1 Hour' && styles.activePresetBtnText,
                  ]}
                >
                  Past 1 Hour
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Past 2 Hours' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Past 2 Hours', 'minutes', 120)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Past 2 Hours' && styles.activePresetBtnText,
                  ]}
                >
                  Past 2 Hours
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Today' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Today', 'days', 1)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Today' && styles.activePresetBtnText,
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Last 7 Days' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Last 7 Days', 'days', 7)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Last 7 Days' && styles.activePresetBtnText,
                  ]}
                >
                  Last 7 Days
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Last 15 Days' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Last 15 Days', 'days', 15)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Last 15 Days' && styles.activePresetBtnText,
                  ]}
                >
                  Last 15 Days
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  activeQuickRange?.label === 'Last 30 Days' && styles.activePresetBtn,
                ]}
                onPress={() => handleQuickRange('Last 30 Days', 'days', 30)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    activeQuickRange?.label === 'Last 30 Days' && styles.activePresetBtnText,
                  ]}
                >
                  Last 30 Days
                </Text>
              </TouchableOpacity>
            </View>

            {/* RIGHT SIDE */}
            <View style={styles.rightContainer}>
              {/* Sub tab navigation */}
              <View style={styles.subTabRow}>
                <Pressable
                  onPress={() => handleSubTabChange(DateRangeSelectionType.TIME_RANGE_TODAY)}
                  style={[
                    styles.subTabBtn,
                    activeSubTab === DateRangeSelectionType.TIME_RANGE_TODAY &&
                      styles.subTabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.subTabBtnText,
                      activeSubTab === DateRangeSelectionType.TIME_RANGE_TODAY &&
                        styles.subTabBtnTextActive,
                    ]}
                  >
                    Time Range (Today)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSubTabChange(DateRangeSelectionType.SINGLE_DATE)}
                  style={[
                    styles.subTabBtn,
                    activeSubTab === DateRangeSelectionType.SINGLE_DATE && styles.subTabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.subTabBtnText,
                      activeSubTab === DateRangeSelectionType.SINGLE_DATE &&
                        styles.subTabBtnTextActive,
                    ]}
                  >
                    Specific Date
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSubTabChange(DateRangeSelectionType.DATE_RANGE)}
                  style={[
                    styles.subTabBtn,
                    activeSubTab === DateRangeSelectionType.DATE_RANGE && styles.subTabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.subTabBtnText,
                      activeSubTab === DateRangeSelectionType.DATE_RANGE &&
                        styles.subTabBtnTextActive,
                    ]}
                  >
                    Date Range
                  </Text>
                </Pressable>
              </View>

              {/* SUB TAB CONTENT */}
              <View style={{ flex: 1, minHeight: 300 }}>
                {activeSubTab === DateRangeSelectionType.TIME_RANGE_TODAY && (
                  <View style={styles.subTabContent}>
                    <Text style={styles.instructions}>Select a start & end time for today:</Text>

                    {/* Time columns */}
                    <View
                      style={[
                        styles.timeRangeContainer,
                        { flexDirection: screenWidth < 500 ? 'column' : 'row' },
                      ]}
                    >
                      {/* Start Time */}
                      <View
                        style={[
                          styles.timeColumn,
                          { width: screenWidth < 500 ? '100%' : '48%' }, // Full width on mobile
                        ]}
                      >
                        <Text style={styles.timeColumnTitle}>Start Time</Text>
                        <View style={styles.timePickerRow}>
                          <Pressable
                            style={styles.timeArrowBtn}
                            onPress={() => setTodayStartHour((h) => Math.max(h - 1, 0))}
                          >
                            <FontAwesome5 name="chevron-left" size={14} color="#333" />
                          </Pressable>
                          <Text style={styles.timeValue}>
                            {String(todayStartHour).padStart(2, '0')}h
                          </Text>
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
                          <Text style={styles.timeValue}>
                            {String(todayStartMin).padStart(2, '0')}m
                          </Text>
                          <Pressable
                            style={styles.timeArrowBtn}
                            onPress={() => setTodayStartMin((m) => (m === 59 ? 0 : m + 1))}
                          >
                            <FontAwesome5 name="chevron-right" size={14} color="#333" />
                          </Pressable>
                        </View>
                      </View>

                      {/* End Time */}
                      <View
                        style={[
                          styles.timeColumn,
                          { width: screenWidth < 500 ? '100%' : '48%' }, // Full width on mobile
                        ]}
                      >
                        <Text style={styles.timeColumnTitle}>End Time</Text>
                        <View style={styles.timePickerRow}>
                          <Pressable
                            style={styles.timeArrowBtn}
                            onPress={() => setTodayEndHour((h) => Math.max(h - 1, 0))}
                          >
                            <FontAwesome5 name="chevron-left" size={14} color="#333" />
                          </Pressable>
                          <Text style={styles.timeValue}>
                            {String(todayEndHour).padStart(2, '0')}h
                          </Text>
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
                          <Text style={styles.timeValue}>
                            {String(todayEndMin).padStart(2, '0')}m
                          </Text>
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
                )}

                {activeSubTab === DateRangeSelectionType.SINGLE_DATE && (
                  <View style={styles.subTabContent}>
                    <Text style={styles.instructions}>Select a single date below:</Text>
                    {/* Month nav */}
                    <View style={styles.monthNav}>
                      <Pressable onPress={prevMonth} style={styles.navBtn}>
                        <FontAwesome5 name="chevron-left" size={14} color="#333" />
                      </Pressable>
                      <Text style={styles.monthText}>
                        {currentMonth.toLocaleString('default', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                      <Pressable onPress={nextMonth} style={styles.navBtn}>
                        <FontAwesome5 name="chevron-right" size={14} color="#333" />
                      </Pressable>
                    </View>

                    {/* Weekdays row */}
                    <View style={styles.weekdaysRow}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                        <Text key={d} style={styles.weekdayText}>
                          {d}
                        </Text>
                      ))}
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                      {calendarDays.map((day, idx) => {
                        const dayAtMidnight = atMidnight(day);
                        const isInMonth = day.getMonth() === currentMonth.getMonth();
                        const isSelected = dayAtMidnight.getTime() === singleDate.getTime();
                        return (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => handleDayPress(day)}
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
                )}

                {activeSubTab === DateRangeSelectionType.DATE_RANGE && (
                  <View style={styles.subTabContent}>
                    <Text style={styles.instructions}>
                      Select up to two dates (start & end). Third click resets.
                    </Text>

                    <View style={styles.monthNav}>
                      <Pressable onPress={prevMonth} style={styles.navBtn}>
                        <FontAwesome5 name="chevron-left" size={14} color="#333" />
                      </Pressable>
                      <Text style={styles.monthText}>
                        {currentMonth.toLocaleString('default', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                      <Pressable onPress={nextMonth} style={styles.navBtn}>
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
                        const inRange = isInSelectedRange(dayAtMidnight);

                        return (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => handleDayPress(day)}
                            style={[
                              styles.dayContainer,
                              !isInMonth && styles.outsideMonth,
                              inRange && styles.selectedDay,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dayText,
                                !isInMonth && styles.outsideMonthText,
                                inRange && styles.selectedDayText,
                              ]}
                            >
                              {day.getDate()}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
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

// --------------------- STYLES ---------------------

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
  leftColumn: {
    backgroundColor: '#ECF1F5',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#D8D8D8',
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
  instructions: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },

  // Time Range Layout
  timeRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  timeColumn: {
    width: '48%',
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

  // Calendar
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

  // Footer
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
