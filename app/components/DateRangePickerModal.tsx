import React, { useMemo, useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Platform } from 'react-native';

import { QuickRangePanel } from './date/QuickRangePanel';
import { ADDatePicker } from './date/AD/ADDatePicker';
import { BSDatePicker, BsMonth } from './date/BS/BSDatePicker';

import {
  atMidnight,
  DateRangeSelection,
  DateRangeSelectionType,
  QuickRangeItem,
  QuickRangePayload,
} from './date/utils';

import { adToBs, bsToAd, bsToIso, getTodayBsInKathmandu, nextBsMonth } from './date/BS/bs-adapter';
import { addDaysKtm, adToIso, pad2 } from './date/BS/kathmandu-date';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

// BS adapter (for Month/BS conversions when applying)
export enum CalendarMode {
  EN = 'EN',
  NP = 'NP',
}

type BsDate = { year: number; month: number; day: number };

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
  const displayedSubTabs = enabledSubTabs;

  const { isLargeScreen } = useIsDesktop();

  // Parent owns "mode" + "active tab"
  const [calendarMode, setCalendarMode] = useState<CalendarMode>(CalendarMode.EN);
  const [activeSubTab, setActiveSubTab] = useState<DateRangeSelectionType>(
    DateRangeSelectionType.TIME_RANGE_TODAY,
  );

  // Parent owns AD state
  const [activeQuickRange, setActiveQuickRange] = useState<QuickRangePayload | null>(null);

  const [todayStartHour, setTodayStartHour] = useState(0);
  const [todayStartMin, setTodayStartMin] = useState(0);
  const [todayEndHour, setTodayEndHour] = useState(1);
  const [todayEndMin, setTodayEndMin] = useState(0);

  const [singleDate, setSingleDate] = useState<Date>(atMidnight(new Date()));

  const [startDateRange, setStartDateRange] = useState<Date>(atMidnight(new Date()));
  const [endDateRange, setEndDateRange] = useState<Date>(atMidnight(new Date()));
  const [rangeClicks, setRangeClicks] = useState(0);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Parent owns BS state
  const todayBs = useMemo(() => getTodayBsInKathmandu(), []);

  const [singleBsDate, setSingleBsDate] = useState(todayBs);
  const [startBsRange, setStartBsRange] = useState(todayBs);
  const [endBsRange, setEndBsRange] = useState(todayBs);
  const [bsRangeClicks, setBsRangeClicks] = useState(0);

  const [currentBsMonth, setCurrentBsMonth] = useState<BsMonth>({
    year: todayBs.year,
    month: todayBs.month,
  });

  const [selectedBsMonth, setSelectedBsMonth] = useState<BsMonth>({
    year: todayBs.year,
    month: todayBs.month,
  });

  // Month tab flag (BS only)
  const [isBsMonthTab, setIsBsMonthTab] = useState(false);

  // Parent handlers
  const handleQuickRange = (label: string, unit?: 'minutes' | 'days', value?: number) => {
    setActiveQuickRange({ label, unit, value });
    setActiveSubTab(DateRangeSelectionType.QUICK_RANGE);
    setIsBsMonthTab(false);
  };

  const handleSubTabChange = (tab: DateRangeSelectionType) => {
    setActiveSubTab(tab);
    setIsBsMonthTab(false);

    switch (tab) {
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

  // AD Calendar: build 42 days
  const adCalendarDays = useMemo(() => {
    const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const dayOfWeek = firstOfMonth.getDay(); // 0=Sun..6=Sat
    const offset = (dayOfWeek + 6) % 7; // Mon=0

    const start = new Date(firstOfMonth);
    start.setDate(start.getDate() - offset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const adPrevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const adNextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const handleAdDayPress = (day: Date) => {
    const clickedMidnight = atMidnight(day);

    if (activeSubTab === DateRangeSelectionType.SINGLE_DATE) {
      setSingleDate(clickedMidnight);
    } else if (activeSubTab === DateRangeSelectionType.DATE_RANGE) {
      if (rangeClicks === 0) {
        setStartDateRange(clickedMidnight);
        setEndDateRange(clickedMidnight);
        setRangeClicks(1);
      } else if (rangeClicks === 1) {
        if (clickedMidnight.getTime() < startDateRange.getTime()) {
          setEndDateRange(startDateRange);
          setStartDateRange(clickedMidnight);
        } else {
          setEndDateRange(clickedMidnight);
        }
        setRangeClicks(2);
      } else {
        setStartDateRange(clickedMidnight);
        setEndDateRange(clickedMidnight);
        setRangeClicks(1);
      }
    }
  };

  const isInAdSelectedRange = (day: Date) => {
    const t = day.getTime();
    const s = startDateRange.getTime();
    const e = endDateRange.getTime();
    return t >= Math.min(s, e) && t <= Math.max(s, e);
  };

  // BS month navigation helpers
  const bsPrevMonth = () => {
    setCurrentBsMonth((m) =>
      m.month === 1 ? { year: m.year - 1, month: 12 } : { year: m.year, month: m.month - 1 },
    );
  };

  const bsNextMonth = () => {
    setCurrentBsMonth((m) =>
      m.month === 12 ? { year: m.year + 1, month: 1 } : { year: m.year, month: m.month + 1 },
    );
  };

  // APPLY: single place builds payload (AD or BS)
  const handleApply = () => {
    let result: DateRangeSelection;

    if (activeSubTab === DateRangeSelectionType.QUICK_RANGE) {
      result = {
        selectionType: DateRangeSelectionType.QUICK_RANGE,
        quickRange: activeQuickRange ?? { label: 'Unknown' },
      };
      onApply(result);
      return;
    }

    if (activeSubTab === DateRangeSelectionType.TIME_RANGE_TODAY) {
      result = {
        selectionType: DateRangeSelectionType.TIME_RANGE_TODAY,
        startHour: todayStartHour,
        startMin: todayStartMin,
        endHour: todayEndHour,
        endMin: todayEndMin,
      };
      onApply(result);
      return;
    }

    // EN mode
    if (calendarMode === CalendarMode.EN) {
      if (activeSubTab === DateRangeSelectionType.SINGLE_DATE) {
        result = {
          selectionType: DateRangeSelectionType.SINGLE_DATE,
          date: singleDate.toISOString().split('T')[0],
        };
      } else {
        result = {
          selectionType: DateRangeSelectionType.DATE_RANGE,
          startDate: startDateRange.toISOString().split('T')[0],
          endDate: endDateRange.toISOString().split('T')[0],
        };
      }
      onApply(result);
      return;
    }

    // NP mode
    if (calendarMode === CalendarMode.NP) {
      // Month tab -> DATE_RANGE, converted to AD
      if (isBsMonthTab) {
        // BS month start
        const bsStart: BsDate = {
          year: selectedBsMonth.year,
          month: selectedBsMonth.month,
          day: 1,
        };

        // Next BS month start
        const next = nextBsMonth(selectedBsMonth);
        const bsNextStart: BsDate = { year: next.year, month: next.month, day: 1 };

        // Convert both to AD using your STABLE conversion
        const adStart = bsToAd(bsStart);
        const adNextStart = bsToAd(bsNextStart);

        // End date = day before next month starts (Kathmandu-canonical)
        const adEnd = addDaysKtm(adNextStart, -1);

        // Optional: get the real BS end by converting AD end back to BS (stable)
        const bsEnd = adToBs(adEnd);

        result = {
          selectionType: DateRangeSelectionType.DATE_RANGE,
          startDate: adToIso(adStart),
          endDate: adToIso(adEnd),
          meta: {
            calendar: 'BS',
            mode: 'MONTH',
            bsStart: bsToIso(bsStart),
            bsEnd: bsToIso(bsEnd),
            bsMonth: { year: selectedBsMonth.year, month: selectedBsMonth.month },
          },
        };
        onApply(result);
        return;
      }

      // BS Specific Date -> SINGLE_DATE
      if (activeSubTab === DateRangeSelectionType.SINGLE_DATE) {
        const ad = bsToAd(singleBsDate);
        result = {
          selectionType: DateRangeSelectionType.SINGLE_DATE,
          date: adToIso(ad),
          meta: {
            calendar: 'BS',
            bsDate: `${singleBsDate.year}-${pad2(singleBsDate.month)}-${pad2(singleBsDate.day)}`,
          },
        };
        onApply(result);
        return;
      }

      // BS Date Range -> DATE_RANGE
      const adStart = bsToAd(startBsRange);
      const adEnd = bsToAd(endBsRange);

      result = {
        selectionType: DateRangeSelectionType.DATE_RANGE,
        startDate: adToIso(adStart),
        endDate: adToIso(adEnd),
        meta: {
          calendar: 'BS',
          mode: 'DATE_RANGE',
          bsStart: `${startBsRange.year}-${pad2(startBsRange.month)}-${pad2(startBsRange.day)}`,
          bsEnd: `${endBsRange.year}-${pad2(endBsRange.month)}-${pad2(endBsRange.day)}`,
        },
      };
      onApply(result);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalContainer, !isLargeScreen && styles.modalContainerSmall]}>
          <View style={[styles.topRow, { minHeight: 500 }]}>
            {/* LEFT (only large screens) */}
            {isLargeScreen && quickRanges?.length ? (
              <QuickRangePanel
                quickRanges={quickRanges}
                activeQuickRange={activeQuickRange}
                onSelectRange={handleQuickRange}
              />
            ) : null}

            {/* RIGHT */}
            <View style={styles.rightContainer}>
              {/* mode toggle */}
              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => setCalendarMode(CalendarMode.EN)}
                  style={[styles.modeBtn, calendarMode === CalendarMode.EN && styles.modeBtnActive]}
                >
                  <Text
                    style={[
                      styles.modeBtnText,
                      calendarMode === CalendarMode.EN && styles.modeBtnTextActive,
                    ]}
                  >
                    English
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setCalendarMode(CalendarMode.NP)}
                  style={[styles.modeBtn, calendarMode === CalendarMode.NP && styles.modeBtnActive]}
                >
                  <Text
                    style={[
                      styles.modeBtnText,
                      calendarMode === CalendarMode.NP && styles.modeBtnTextActive,
                    ]}
                  >
                    Nepali
                  </Text>
                </Pressable>
              </View>

              {/* sub tabs */}
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
                        activeSubTab === subTabType && !isBsMonthTab && styles.subTabBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.subTabBtnText,
                          activeSubTab === subTabType &&
                            !isBsMonthTab &&
                            styles.subTabBtnTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}

                {/* BS-only Month tab */}
                {calendarMode === CalendarMode.NP && (
                  <Pressable
                    onPress={() => {
                      setIsBsMonthTab(true);
                      setActiveSubTab(DateRangeSelectionType.DATE_RANGE);
                    }}
                    style={[styles.subTabBtn, isBsMonthTab && styles.subTabBtnActive]}
                  >
                    <Text
                      style={[styles.subTabBtnText, isBsMonthTab && styles.subTabBtnTextActive]}
                    >
                      Month
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* picker panels */}
              {calendarMode === CalendarMode.EN ? (
                <ADDatePicker
                  activeSubTab={activeSubTab}
                  displayedSubTabs={displayedSubTabs}
                  todayStartHour={todayStartHour}
                  todayStartMin={todayStartMin}
                  todayEndHour={todayEndHour}
                  todayEndMin={todayEndMin}
                  setTodayStartHour={setTodayStartHour}
                  setTodayStartMin={setTodayStartMin}
                  setTodayEndHour={setTodayEndHour}
                  setTodayEndMin={setTodayEndMin}
                  singleDate={singleDate}
                  currentMonth={currentMonth}
                  calendarDays={adCalendarDays}
                  onPrevMonth={adPrevMonth}
                  onNextMonth={adNextMonth}
                  onDayPress={handleAdDayPress}
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  isInSelectedRange={isInAdSelectedRange}
                />
              ) : (
                <BSDatePicker
                  activeSubTab={activeSubTab}
                  displayedSubTabs={displayedSubTabs}
                  isMonthTab={isBsMonthTab}
                  todayStartHour={todayStartHour}
                  todayStartMin={todayStartMin}
                  todayEndHour={todayEndHour}
                  todayEndMin={todayEndMin}
                  setTodayStartHour={setTodayStartHour}
                  setTodayStartMin={setTodayStartMin}
                  setTodayEndHour={setTodayEndHour}
                  setTodayEndMin={setTodayEndMin}
                  singleBsDate={singleBsDate}
                  setSingleBsDate={setSingleBsDate}
                  startBsRange={startBsRange}
                  endBsRange={endBsRange}
                  bsRangeClicks={bsRangeClicks}
                  setStartBsRange={setStartBsRange}
                  setEndBsRange={setEndBsRange}
                  setBsRangeClicks={setBsRangeClicks}
                  currentBsMonth={currentBsMonth}
                  onPrevBsMonth={bsPrevMonth}
                  onNextBsMonth={bsNextMonth}
                  selectedBsMonth={selectedBsMonth}
                  setSelectedBsMonth={setSelectedBsMonth}
                />
              )}

              {/* FOOTER (common) */}
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
  modalContainerSmall: {
    width: '95%',
    maxWidth: 520,
  },

  topRow: { flexDirection: 'row' },
  rightContainer: { flex: 1, padding: 12 },

  modeRow: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#F0F2F4',
    borderRadius: 6,
    padding: 4,
  },
  modeBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  modeBtnActive: { backgroundColor: '#2A4759' },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: '#666' },
  modeBtnTextActive: { color: '#FFF' },

  subTabRow: { flexDirection: 'row', marginBottom: 10 },
  subTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  subTabBtnActive: { backgroundColor: '#2A4759' },
  subTabBtnText: { color: '#666', fontSize: 13, fontWeight: '600' },
  subTabBtnTextActive: { color: '#FFF' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopColor: '#DDD',
    borderTopWidth: 1,
    marginTop: 8,
  },
  btn: { paddingVertical: 12, paddingHorizontal: 26, borderRadius: 4, marginLeft: 10 },
  btnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  cancelBtn: { backgroundColor: '#777' },
  applyBtn: { backgroundColor: '#2A4759' },
});
