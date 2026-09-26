import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import NotificationBar from 'app/components/common/NotificationBar';
import SubTab from 'app/components/common/SubTab';
import { DateRangePickerModal } from 'app/components/DateRangePickerModal';
import { useTheme } from 'app/hooks/useTheme';
import { useLoginActivity } from 'app/hooks/useLoginActivity';
import { DateRangeSelectionType, LoginActivity } from 'app/api/services/loginActivityService';
import { DateRangeSelection, getDisplayDateRange } from 'app/components/date/utils';

/* ─── constants ─── */
const tabs = ['Past Logins', 'Todays'];
type TabType = (typeof tabs)[number];

const formatLast7DaysSelection = (): DateRangeSelection => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  return {
    selectionType: DateRangeSelectionType.DATE_RANGE,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    meta: { calendar: 'AD', mode: 'DATE_RANGE' },
  };
};

const initialSelectedDateRange = formatLast7DaysSelection();

/* ─── responsive helpers ─── */
type LayoutTier = 'phone' | 'tablet' | 'desktop';

function useLayoutTier(): { tier: LayoutTier; columns: number; width: number } {
  const { width } = useWindowDimensions();
  const tier: LayoutTier = width >= 1024 ? 'desktop' : width >= 600 ? 'tablet' : 'phone';
  const columns = tier === 'desktop' ? 3 : tier === 'tablet' ? 2 : 1;
  return { tier, columns, width };
}

/* ─── status helpers ─── */
const STATUS_STYLES = {
  SUCCESS: {
    border: 'rgba(34,197,94,0.22)',
    pillBg: 'rgba(34,197,94,0.10)',
    pillText: '#16a34a',
    dot: '#22c55e',
  },
  FAILURE: {
    border: 'rgba(239,68,68,0.22)',
    pillBg: 'rgba(239,68,68,0.10)',
    pillText: '#dc2626',
    dot: '#ef4444',
  },
} as const;

function getStatusStyle(status: string) {
  return status === 'SUCCESS' ? STATUS_STYLES.SUCCESS : STATUS_STYLES.FAILURE;
}

/* ═══════════════════════════════════════════════
   LoginActivityCard — redesigned
   ═══════════════════════════════════════════════ */
const LoginActivityCard = ({
  item,
  theme,
  tier,
}: {
  item: LoginActivity;
  theme: ReturnType<typeof useTheme>;
  tier: LayoutTier;
}) => {
  const s = getStatusStyle(item.status);
  const displayName =
    item.firstName || item.lastName
      ? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()
      : item.username || item.usernameAttempted || 'Unknown User';

  const isWide = tier !== 'phone';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.secondaryBg,
          borderColor: s.border,
          // wider cards on tablet/desktop get slightly more padding
          ...(isWide && { paddingHorizontal: 20, paddingVertical: 18 }),
        },
      ]}
    >
      {/* ── top row: avatar-like initial + name + status ── */}
      <View style={styles.cardTopRow}>
        {/* monogram circle */}
        <View style={[styles.monogram, { backgroundColor: s.pillBg, borderColor: s.border }]}>
          <Text style={[styles.monogramText, { color: s.pillText }]}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.cardTitleWrap}>
          <Text style={[styles.cardTitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textTertiary }]} numberOfLines={1}>
            {item.username || item.usernameAttempted || '—'}
          </Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: s.pillBg }]}>
          <View style={[styles.statusDot, { backgroundColor: s.dot }]} />
          <Text style={[styles.statusPillText, { color: s.pillText }]}>{item.status}</Text>
        </View>
      </View>

      {/* ── meta grid ── */}
      <View style={[styles.metaGrid, isWide && { gap: 16 }]}>
        {[
          { label: 'Event', value: item.eventType },
          { label: 'Platform', value: item.platform || 'UNKNOWN' },
          { label: 'Device', value: item.deviceType || 'UNKNOWN' },
          { label: 'IP Address', value: item.ipAddress },
        ].map((m) => (
          <View key={m.label} style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: theme.textTertiary }]}>{m.label}</Text>
            <Text style={[styles.metaValue, { color: theme.textSecondary }]} numberOfLines={1}>
              {m.value || '—'}
            </Text>
          </View>
        ))}
      </View>

      {/* ── footer: timestamp + version ── */}
      <View style={styles.cardFooter}>
        <Text style={[styles.timeText, { color: theme.textTertiary }]}>{item.eventAt || '—'}</Text>
        {!!item.appVersion && (
          <Text style={[styles.auxText, { color: theme.mutedIcon }]}>v{item.appVersion}</Text>
        )}
      </View>

      {/* ── failure banner ── */}
      {!!item.failureReason && (
        <View style={styles.failureBox}>
          <Text style={styles.failureLabel}>Failure Reason</Text>
          <Text style={styles.failureText}>{item.failureReason}</Text>
        </View>
      )}
    </View>
  );
};

/* ═══════════════════════════════════════════════
   LoginActivityScreen — redesigned
   ═══════════════════════════════════════════════ */
const LoginActivityScreen = ({ navigation }: { navigation: any }) => {
  const theme = useTheme();
  const { tier, columns } = useLayoutTier();

  const {
    loginActivities,
    fetchTodayLoginActivities,
    fetchLoginActivitiesByDate,
    fetchLoginActivitiesByDateRange,
    getTodayLoginActivityState,
    getLoginActivityByDateState,
    getLoginActivityByDateRangeState,
    searchTerm,
    setSearchTerm,
  } = useLoginActivity();

  const [activeTab, setActiveTab] = useState<TabType>('Todays');
  const [isRangeModalVisible, setRangeModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection>({
    selectionType: DateRangeSelectionType.SINGLE_DATE,
    date: 'Today',
  });
  const [displayDateRange, setDisplayDateRange] = useState(
    getDisplayDateRange(initialSelectedDateRange),
  );
  const [errorNotification, setErrorNotification] = useState('');
  const [successNotification, setSuccessNotification] = useState('');

  const isLoading =
    getTodayLoginActivityState.status === 'pending' ||
    getLoginActivityByDateState.status === 'pending' ||
    getLoginActivityByDateRangeState.status === 'pending';

  /* ── API helpers ── */
  const applySelectionToApi = useCallback(
    (selection: DateRangeSelection) => {
      if (selection.selectionType === DateRangeSelectionType.SINGLE_DATE) {
        fetchLoginActivitiesByDate(selection.date);
        return;
      }
      if (selection.selectionType === DateRangeSelectionType.DATE_RANGE) {
        fetchLoginActivitiesByDateRange(selection.startDate, selection.endDate);
      }
    },
    [fetchLoginActivitiesByDate, fetchLoginActivitiesByDateRange],
  );

  const handleDateRangeApply = useCallback(
    (selection: DateRangeSelection) => {
      if (
        selection.selectionType !== DateRangeSelectionType.SINGLE_DATE &&
        selection.selectionType !== DateRangeSelectionType.DATE_RANGE
      )
        return;
      setRangeModalVisible(false);
      setSelectedRange(selection);
      setDisplayDateRange(getDisplayDateRange(selection));
      applySelectionToApi(selection);
    },
    [applySelectionToApi],
  );

  const handleLast7Days = useCallback(() => {
    const selection = formatLast7DaysSelection();
    setSelectedRange(selection);
    setDisplayDateRange(getDisplayDateRange(selection));
    applySelectionToApi(selection);
  }, [applySelectionToApi]);

  const handleTodayTab = useCallback(() => {
    fetchTodayLoginActivities();
  }, [fetchTodayLoginActivities]);

  const handlePastTab = useCallback(() => {
    const selection = initialSelectedDateRange;
    setDisplayDateRange(getDisplayDateRange(selection));
    applySelectionToApi(selection);
  }, [applySelectionToApi, selectedRange]);

  useEffect(() => {
    handleTodayTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mutations = [
      getTodayLoginActivityState,
      getLoginActivityByDateState,
      getLoginActivityByDateRangeState,
    ];
    const errorState = mutations.find((m) => m.status === 'error');
    const successState = mutations.find((m) => m.status === 'success');
    if (errorState) {
      setErrorNotification(errorState.error?.message || 'Oops! Something went wrong.');
      errorState.reset?.();
    }
    if (successState) {
      setSuccessNotification('Login activity loaded successfully.');
      successState.reset?.();
    }
  }, [getTodayLoginActivityState, getLoginActivityByDateState, getLoginActivityByDateRangeState]);

  /* ── Responsive content width for desktop centering ── */
  const contentPadH = tier === 'desktop' ? 32 : tier === 'tablet' ? 24 : 16;

  /* ── Header ── */
  const headerElement = useMemo(() => {
    const showPastControls = activeTab === 'Past Logins';

    return (
      <View style={[styles.headerContainer, { backgroundColor: theme.primaryBg }]}>
        {/* sub tabs — full width, no padding */}
        <View style={styles.subTabWrap}>
          <SubTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(newTab) => {
              setActiveTab(newTab);
              setSearchTerm('');
              navigation?.setParams?.({ selectedTab: newTab });
              if (newTab === 'Todays') handleTodayTab();
              else handlePastTab();
            }}
          />
        </View>

        {/* filter controls — full width row like Orders screen */}
        {showPastControls && (
          <View style={[styles.filterBar, { paddingHorizontal: contentPadH }]}>
            <TouchableOpacity
              onPress={handleLast7Days}
              style={[styles.chipBtn, { backgroundColor: theme.secondary }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipBtnText, { color: theme.textPrimary }]}>Last 7 Days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRangeModalVisible(true)}
              style={[
                styles.dateBtn,
                {
                  backgroundColor: theme.secondaryBg,
                  borderColor: theme.borderColor,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.dateBtnText, { color: theme.textSecondary }]} numberOfLines={1}>
                📅 {displayDateRange}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* summary row */}
        <View style={[styles.summaryRow, { paddingHorizontal: contentPadH }]}>
          <Text style={[styles.summaryText, { color: theme.textTertiary }]}>
            {loginActivities.length} record{loginActivities.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    );
  }, [
    activeTab,
    contentPadH,
    displayDateRange,
    handleLast7Days,
    handlePastTab,
    handleTodayTab,
    loginActivities.length,
    navigation,
    searchTerm,
    setSearchTerm,
    theme,
  ]);

  /* ── Multi-column grid renderer ── */
  const renderGridItem = useCallback(
    ({ item }: { item: LoginActivity }) => {
      const cardWidth = columns > 1 ? `${(100 / columns).toFixed(2)}%` : '100%';

      return (
        <View
          style={[
            styles.gridCell,
            {
              width: cardWidth as any,
              paddingHorizontal: columns > 1 ? 6 : 0,
            },
          ]}
        >
          <LoginActivityCard item={item} theme={theme} tier={tier} />
        </View>
      );
    },
    [columns, theme, tier],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryBg }]}>
      {isLoading ? (
        <FoodLoadingSpinner iconName="history" />
      ) : (
        <FlatList
          data={loginActivities}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={headerElement}
          stickyHeaderIndices={[0]}
          renderItem={renderGridItem}
          key={`grid-${columns}`}
          numColumns={columns}
          columnWrapperStyle={
            columns > 1 ? [styles.columnWrapper, { paddingHorizontal: contentPadH - 6 }] : undefined
          }
          ListEmptyComponent={
            <View style={[styles.emptyWrap, { paddingHorizontal: contentPadH }]}>
              <EmptyState
                iconName="history"
                message="No login activity found"
                subMessage="Try adjusting your date range or check back later."
                iconSize={tier === 'phone' ? 80 : 100}
              />
            </View>
          }
          contentContainerStyle={[styles.listContent]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        />
      )}

      <DateRangePickerModal
        visible={isRangeModalVisible}
        onClose={() => setRangeModalVisible(false)}
        onApply={handleDateRangeApply}
        hideQuickRanges={true}
        hideTimeRangeSubTabs={true}
      />

      <NotificationBar
        message={errorNotification}
        variant="error"
        onClose={() => setErrorNotification('')}
      />
      {/* <NotificationBar
        message={successNotification}
        onClose={() => setSuccessNotification('')}
      /> */}
    </View>
  );
};

export default LoginActivityScreen;

/* ═══════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════ */
const styles = StyleSheet.create({
  /* ── layout ── */
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  columnWrapper: {
    marginBottom: 0,
  },
  gridCell: {
    paddingBottom: 0,
  },

  /* ── header ── */
  headerContainer: {
    paddingTop: 0,
    paddingBottom: 6,
  },
  subTabWrap: {
    marginBottom: 12,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  chipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  chipBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dateBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dateBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* ── card ── */
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
      web: {
        // @ts-ignore — web-only
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        // @ts-ignore
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },

  /* monogram */
  monogram: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontSize: 16,
    fontWeight: '800',
  },

  cardTitleWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* status pill */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  /* meta grid */
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  metaItem: {
    minWidth: '44%',
    flexGrow: 1,
    backgroundColor: 'rgba(148,163,184,0.06)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* card footer */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  auxText: {
    fontSize: 11,
    fontWeight: '500',
  },

  /* failure */
  failureBox: {
    marginTop: 10,
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  failureLabel: {
    color: '#b91c1c',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  failureText: {
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },

  /* empty */
  emptyWrap: {
    paddingTop: 48,
  },
});
