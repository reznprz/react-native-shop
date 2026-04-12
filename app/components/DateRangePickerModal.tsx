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
  hideTimeRangeSubTabs?: boolean;
  hideQuickRanges?: boolean;
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
  hideTimeRangeSubTabs = false,
  hideQuickRanges = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenH, width: screenW } = useWindowDimensions();
  const { isLargeScreen } = useIsDesktop();

  const isPhone = screenW < 768;
  const isTablet = screenW >= 768 && screenW < 1024;
  const isWebDesktop = Platform.OS === 'web' && screenW >= 1024;

  const displayedSubTabs = useMemo(() => {
    return hideTimeRangeSubTabs
      ? enabledSubTabs.filter((tab) => tab !== DateRangeSelectionType.TIME_RANGE_TODAY)
      : enabledSubTabs;
  }, [enabledSubTabs, hideTimeRangeSubTabs]);

  const modalH = isPhone
    ? screenH * 0.92
    : isTablet
      ? Math.min(screenH * 0.82, 860)
      : Math.min(screenH * 0.78, 760);

  const modalW = isPhone
    ? screenW * 0.98
    : isTablet
      ? Math.min(screenW * 0.94, 900)
      : Math.min(screenW * 0.9, 1100);

  const shouldScroll = !isWebDesktop;
  const showQuickRangeSidebar = isWebDesktop && quickRanges?.length && !hideQuickRanges;
  const showQuickRangeTop = !isWebDesktop && quickRanges?.length && !hideQuickRanges;
  const compactSubTabs = hideQuickRanges;

  const [calendarMode, setCalendarMode] = useState<TabType>('NP');
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

  const adCalendarDays = useMemo(() => {
    const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const dayOfWeek = firstOfMonth.getDay();
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

  const colors = useMemo(() => {
    return {
      surface: theme.primaryBg,
      primary: theme.primary ?? '#2A4759',
      border: theme.borderColor ?? '#DDD',
      muted: theme.mutedIcon ?? '#777',
      textMuted: '#666',
      tabBg: '#F8F8F8',
    };
  }, [theme]);

  const renderModeToggle = () => (
    <View style={styles.modeToggleWrap}>
      <SubTab
        tabs={tabs}
        activeTab={calendarMode}
        onTabChange={(selectedTab) => setCalendarMode(selectedTab)}
      />
    </View>
  );

  const renderSubTabs = () => {
    const tabItems = (
      <>
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
                compactSubTabs && styles.subTabBtnCompact,
                isPhone && styles.subTabBtnMobile,
                { backgroundColor: colors.tabBg },
                active && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                numberOfLines={1}
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
              compactSubTabs && styles.subTabBtnCompact,
              isPhone && styles.subTabBtnMobile,
              { backgroundColor: colors.tabBg },
              isBsMonthTab && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              numberOfLines={1}
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
      </>
    );

    if (isPhone) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subTabScroll}
          contentContainerStyle={styles.subTabScrollContent}
        >
          {tabItems}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.subTabRow, compactSubTabs && styles.subTabRowCompact]}>{tabItems}</View>
    );
  };

  const renderPicker = () => (
    <View style={{ flex: 1, minHeight: isPhone ? 420 : 0 }}>
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
          hideTimeRangeSubTabs={hideTimeRangeSubTabs}
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
          hideTimeRangeSubTabs={hideTimeRangeSubTabs}
        />
      )}
    </View>
  );

  const renderFooter = () => (
    <View
      style={[
        styles.footer,
        isPhone && styles.footerMobile,
        { borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <Pressable
        onPress={onClose}
        style={[styles.btn, isPhone && styles.btnMobile, { backgroundColor: colors.muted }]}
      >
        <Text style={styles.btnText}>Cancel</Text>
      </Pressable>

      <Pressable
        onPress={handleApply}
        style={[styles.btn, isPhone && styles.btnMobile, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.btnText}>Apply</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.centerWrap, isPhone && styles.centerWrapMobile]}>
          <View
            style={[
              styles.modalContainer,
              isPhone && styles.modalContainerMobile,
              {
                width: modalW,
                height: modalH,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View style={[styles.topRow, !showQuickRangeSidebar && styles.topRowStack]}>
              {showQuickRangeSidebar ? (
                <QuickRangePanel
                  quickRanges={quickRanges}
                  activeQuickRange={activeQuickRange}
                  onSelectRange={handleQuickRange}
                />
              ) : null}

              <View style={styles.rightContainer}>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={styles.contentContainer}
                  showsVerticalScrollIndicator
                  bounces={shouldScroll}
                >
                  {showQuickRangeTop ? (
                    <View style={styles.quickRangeTopWrap}>
                      <QuickRangePanel
                        quickRanges={quickRanges}
                        activeQuickRange={activeQuickRange}
                        onSelectRange={handleQuickRange}
                      />
                    </View>
                  ) : null}

                  {renderModeToggle()}
                  {renderSubTabs()}
                  {renderPicker()}
                </ScrollView>

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
    paddingVertical: 16,
  },
  centerWrapMobile: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxWidth: 1100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContainerMobile: {
    borderRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 0,
  },
  topRowStack: {
    flexDirection: 'column',
  },
  rightContainer: {
    flex: 1,
    padding: 12,
    minHeight: 0,
  },
  contentContainer: {
    flexGrow: 0,
    paddingBottom: 12,
  },
  quickRangeTopWrap: {
    marginBottom: 12,
  },
  modeToggleWrap: {
    marginBottom: 12,
  },
  subTabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  subTabRowCompact: {
    justifyContent: 'flex-start',
  },
  subTabScroll: {
    marginBottom: 12,
  },
  subTabScrollContent: {
    paddingRight: 8,
    alignItems: 'center',
    gap: 8,
  },
  subTabBtn: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  subTabBtnCompact: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 140,
    maxWidth: 180,
  },
  subTabBtnMobile: {
    minWidth: 132,
    maxWidth: undefined,
  },
  subTabBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  footerMobile: {
    justifyContent: 'space-between',
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  btnMobile: {
    flex: 1,
    paddingHorizontal: 16,
  },
  btnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },
});
