import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

import { adToBs, bsToAd, getTodayBsInKathmandu, nextBsMonth } from './date/BS/bs-adapter';
import { addDaysKtm, adToIso, pad2 } from './date/BS/kathmandu-date';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useTheme } from 'app/hooks/useTheme';
import SubTab from './common/SubTab';

export enum CalendarMode {
  EN = 'EN',
  NP = 'NP',
}

const tabs = ['EN', 'NP'];
type TabType = (typeof tabs)[number];

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenH, width: screenW } = useWindowDimensions();
  const { isLargeScreen } = useIsDesktop();

  const displayedSubTabs = enabledSubTabs;

  // IMPORTANT: give modal an explicit height on iOS/Android
  const modalH = Platform.OS === 'web' ? 550 : Math.min(screenH * 0.58, 760);
  const modalW = Platform.OS === 'web' ? 800 : Math.min(screenW * 0.95, isLargeScreen ? 820 : 560);

  const shouldScroll = Platform.OS !== 'web' || !isLargeScreen;

  // Parent owns "mode" + "active tab"
  const [calendarMode, setCalendarMode] = useState<TabType>('EN');
  const [activeSubTab, setActiveSubTab] = useState<DateRangeSelectionType>(displayedSubTabs[0]);

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

  const [isBsMonthTab, setIsBsMonthTab] = useState(false);

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

  // AD calendar
  const adCalendarDays = useMemo(() => {
    const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const dayOfWeek = firstOfMonth.getDay();
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

  // BS month navigation
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

    if (calendarMode === CalendarMode.NP) {
      if (isBsMonthTab) {
        const bsStart: BsDate = {
          year: selectedBsMonth.year,
          month: selectedBsMonth.month,
          day: 1,
        };
        const next = nextBsMonth(selectedBsMonth);
        const bsNextStart: BsDate = { year: next.year, month: next.month, day: 1 };

        const adStart = bsToAd(bsStart);
        const adNextStart = bsToAd(bsNextStart);
        const adEnd = addDaysKtm(adNextStart, -1);
        const bsEnd = adToBs(adEnd);

        result = {
          selectionType: DateRangeSelectionType.DATE_RANGE,
          startDate: adToIso(adStart),
          endDate: adToIso(adEnd),
          meta: {
            calendar: 'BS',
            mode: 'MONTH',
            bsStart: `${bsStart.year}-${pad2(bsStart.month)}-${pad2(bsStart.day)}`,
            bsEnd: `${bsEnd.year}-${pad2(bsEnd.month)}-${pad2(bsEnd.day)}`,
            bsMonth: { year: selectedBsMonth.year, month: selectedBsMonth.month },
          },
        };
        onApply(result);
        return;
      }

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

  // ---------- UI helpers (common code moved into funcs) ----------
  const colors = useMemo(() => {
    return {
      surface: theme.primaryBg,
      primary: theme.primary ?? '#2A4759',
      primaryBg: theme.primaryBg ?? '#F0F2F4',
      border: theme.borderColor ?? '#DDD',
      muted: theme.mutedIcon ?? '#777',
      textMuted: '#666',
      tabBg: '#F8F8F8',
    };
  }, [theme]);

  const renderModeToggle = () => (
    <View className="mb-4">
      <SubTab
        tabs={tabs}
        activeTab={calendarMode}
        onTabChange={(selectedTab) => setCalendarMode(selectedTab)}
      />
    </View>
  );

  const renderSubTabs = () => (
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

        const active = activeSubTab === subTabType && !isBsMonthTab;

        return (
          <Pressable
            key={subTabType}
            onPress={() => handleSubTabChange(subTabType)}
            style={[
              styles.subTabBtn,
              { backgroundColor: colors.tabBg },
              active && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.subTabBtnText,
                { color: colors.textMuted },
                active && { color: '#FFF' },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}

      {calendarMode === CalendarMode.NP && (
        <Pressable
          onPress={() => {
            setIsBsMonthTab(true);
            setActiveSubTab(DateRangeSelectionType.DATE_RANGE);
          }}
          style={[
            styles.subTabBtn,
            { backgroundColor: colors.tabBg },
            isBsMonthTab && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.subTabBtnText,
              { color: colors.textMuted },
              isBsMonthTab && { color: '#FFF' },
            ]}
          >
            Month
          </Text>
        </Pressable>
      )}
    </View>
  );

  const renderPicker = () => (
    <View style={{ flex: 1, minHeight: 0 }}>
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
    </View>
  );

  const renderFooter = () => (
    <View style={[styles.footer, { borderTopColor: colors.border }]}>
      <Pressable onPress={onClose} style={[styles.btn, { backgroundColor: colors.muted }]}>
        <Text style={styles.btnText}>Cancel</Text>
      </Pressable>
      <Pressable onPress={handleApply} style={[styles.btn, { backgroundColor: colors.primary }]}>
        <Text style={styles.btnText}>Apply</Text>
      </Pressable>
    </View>
  );

  // ---------- render ----------
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Inner centering wrapper avoids iOS collapsing */}
        <View style={styles.centerWrap}>
          <View
            style={[
              styles.modalContainer,
              {
                width: modalW,
                height: modalH, // FIX: explicit height
                backgroundColor: colors.surface,
                paddingBottom: Math.max(insets.bottom, 10),
              },
            ]}
          >
            <View style={styles.topRow}>
              {isLargeScreen && quickRanges?.length ? (
                <QuickRangePanel
                  quickRanges={quickRanges}
                  activeQuickRange={activeQuickRange}
                  onSelectRange={handleQuickRange}
                />
              ) : null}

              <View style={styles.rightContainer}>
                {shouldScroll ? (
                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={true}
                    indicatorStyle="black"
                  >
                    {renderModeToggle()}
                    {renderSubTabs()}
                    {renderPicker()}
                  </ScrollView>
                ) : (
                  <View style={{ flex: 1, minHeight: 0 }}>
                    {renderModeToggle()}
                    {renderSubTabs()}
                    {renderPicker()}
                  </View>
                )}

                {renderFooter()}
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
    alignItems: 'stretch',
  },

  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  modalContainer: {
    maxWidth: 820,
    borderRadius: 12,
    overflow: 'hidden',
  },

  topRow: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 0,
  },

  rightContainer: {
    flex: 1,
    padding: 12,
    minHeight: 0,
  },

  modeRow: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    padding: 4,
  },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeBtnText: { fontSize: 13, fontWeight: '900' },

  subTabRow: { flexDirection: 'row', marginBottom: 10 },
  subTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 10,
  },
  subTabBtnText: { fontSize: 13, fontWeight: '800' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: 8,
  },
  btn: { paddingVertical: 12, paddingHorizontal: 26, borderRadius: 10, marginLeft: 10 },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
});
