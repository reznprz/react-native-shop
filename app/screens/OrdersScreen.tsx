import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useOrder } from 'app/hooks/useOrder';

import { MainTabsParamList, navigate } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';

import { removedFilter } from 'app/components/filter/filter';
import { OrderDetails } from 'app/api/services/orderService';
import { FiltersBottomSheetModal } from 'app/components/filter/FiltersBottomSheetModal';
import { DateRangeSelection, DateRangeSelectionType } from 'app/components/date/utils';

import EmptyState from 'app/components/common/EmptyState';
import OrderScreenHeader from 'app/components/common/OrderScreenHeader';
import SubTab from 'app/components/common/SubTab';

import OrderCard from 'app/components/order/OrderCard';
import OrderMetrics from 'app/components/OrderMetrics';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';
import NotificationBar from 'app/components/common/NotificationBar';
import { Permission } from 'app/security/permission';
import { usePermissionMap } from 'app/security/usePermissionMap';
import { useTheme } from 'app/hooks/useTheme';
import FoodPreparationAnimation from 'app/components/common/FoodPreparationAnimation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const tabs = ['Past Orders', 'Todays Order'];
type TabType = (typeof tabs)[number];

type OrdersScreenProps = NativeStackScreenProps<MainTabsParamList, 'Orders'>;

const initialSelectedDateRange: DateRangeSelection = {
  selectionType: DateRangeSelectionType.QUICK_RANGE,
  quickRange: { label: 'Last 7 Days', unit: 'days', value: 7 },
};

export default function OrdersScreen({ route, navigation }: OrdersScreenProps) {
  const { selectedTab } = route.params || {};

  const theme = useTheme();
  const { isLargeScreen, isMobile } = useIsDesktop();

  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'Todays Order');
  const [forceOrderCard, setForceOrderCard] = useState(false);
  const showFullOrderCard = forceOrderCard;
  const skipNextFocusRef = useRef(false);

  const {
    orders,
    totalAmount,
    paidAmount,
    unpaidAmount,
    totalOrders,
    orderStatuses,
    paymentStatuses,
    orderTypes,
    paymentMethods,
    orderScreenState,
    handleDateSelect,
    handleApplyFilters,
    handleClearFilter,
  } = useOrder();

  const { canViewMetrics, canViewSubTab } = usePermissionMap({
    canViewMetrics: Permission.VIEW_ORDER_SCREEN_METRICS,
    canViewSubTab: Permission.VIEW_ORDERS_SCREEN_SUBTAB,
  });

  /**
   * For date/time selection, we store a union type from the DateRange modal.
   * By default, let's say SINGLE_DATE = "Today"
   */
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection | null>(null);

  /**
   * Whenever `selectedRange` changes, fetch new data (except if it's invalid).
   * For instance, if user picks "Past 15 Mins" or "2025-03-01" date, etc.
   */
  useEffect(() => {
    if (selectedRange) {
      handleDateSelect(selectedRange);
    }
    // Only run when selectedRange changes
  }, [selectedRange]);

  useEffect(() => {
    if (selectedRange && activeTab === 'Past Orders') {
      handleDateSelect(selectedRange);
    }
    // Only run when selectedRange changes
  }, [activeTab]);

  // fetch todays orders
  const handleTodaysSubtabSelect = useCallback(() => {
    handleDateSelect({ selectionType: DateRangeSelectionType.SINGLE_DATE, date: 'Today' });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (skipNextFocusRef.current) {
        skipNextFocusRef.current = false; // reset
        return; // don't reset tab/date or fetch
      }
      if (selectedTab === 'Past Orders') {
        setActiveTab('Past Orders');
        setSelectedRange(initialSelectedDateRange);
      } else {
        setActiveTab('Todays Order');
        setSelectedRange({
          selectionType: DateRangeSelectionType.SINGLE_DATE,
          date: 'Today',
        });
        handleTodaysSubtabSelect();
      }
    }, [selectedTab]),
  );

  /** Called when user selects an order from the list (e.g., on phone). */
  const handleOrderPress = useCallback((order: OrderDetails) => {
    skipNextFocusRef.current = true;
    navigate(ScreenNames.ORDER_DETAILS, {
      orderId: order.orderId.toString(),
      actionType: 'Details',
    });
  }, []);

  /** Called for "More Actions" on an order. */
  const handleMoreActionPress = useCallback((order: OrderDetails) => {
    skipNextFocusRef.current = true;
    navigate(ScreenNames.ORDER_DETAILS, {
      orderId: order.orderId.toString(),
      actionType: 'More Action',
    });
  }, []);

  /** Pull-to-refresh logic. */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    if (selectedRange) {
      if (activeTab === 'Todays Order') {
        await handleDateSelect({
          selectionType: DateRangeSelectionType.SINGLE_DATE,
          date: 'Today',
        });
      } else {
        await handleDateSelect(selectedRange);
      }
    } else {
      if (activeTab === 'Todays Order') {
        await handleDateSelect({
          selectionType: DateRangeSelectionType.SINGLE_DATE,
          date: 'Today',
        });
      }
    }
    setRefreshing(false);
  }, [selectedRange, activeTab]);

  /**
   * Render the list of orders. We show different layouts if isLargeScreen
   * or if the activeTab is "Todays Order" or "Past Orders" (demonstration).
   */
  const renderOrdersList = () => {
    if (!orders || orders.length === 0) {
      return (
        <EmptyState
          iconName="bag-personal"
          message="No Orders available"
          subMessage="Please select different Date or re-apply filter."
          iconSize={80}
        />
      );
    }

    return (
      <>
        {canViewMetrics && (
          <OrderMetrics
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            unpaidAmount={unpaidAmount}
            totalOrders={totalOrders}
            isLargeScreen={isLargeScreen}
          />
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {activeTab === 'Todays Order' ? (
            <View className={`flex-1 gap-1 ${isLargeScreen ? 'flex-row flex-wrap' : ''}`}>
              {orders.map((order) =>
                !showFullOrderCard ? (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    onMoreActionPress={handleMoreActionPress}
                  />
                ) : (
                  <TouchableOpacity key={order.orderId} onPress={() => handleOrderPress(order)}>
                    <OrderSummaryCard order={order} showTable={false} />
                  </TouchableOpacity>
                ),
              )}
            </View>
          ) : (
            // "Past Orders"
            <View className={`flex gap-1 ${isLargeScreen ? 'flex-row flex-wrap' : ''}`}>
              {orders.map((order) =>
                showFullOrderCard ? (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    onMoreActionPress={handleMoreActionPress}
                  />
                ) : (
                  <TouchableOpacity key={order.orderId} onPress={() => handleOrderPress(order)}>
                    <OrderSummaryCard order={order} showTable={false} />
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}
        </ScrollView>
      </>
    );
  };

  /**
   * Called when user changes the date/time in the header's date range picker
   */
  const handleApplyDate = useCallback((selectedDateRange: DateRangeSelection) => {
    setSelectedRange(selectedDateRange);
  }, []);

  /**
   * Called when user removes a filter chip, we re-apply the filters (the date/time
   * is also part of the final param).
   */
  const handleRemoveFilter = useCallback(
    (removedFilterName: string) => {
      handleApplyFilters(
        removedFilter(removedFilterName, orderStatuses),
        removedFilter(removedFilterName, paymentStatuses),
        removedFilter(removedFilterName, orderTypes),
        removedFilter(removedFilterName, paymentMethods),
        selectedRange ? selectedRange : initialSelectedDateRange,
      );
    },
    [orderStatuses, paymentStatuses, orderTypes, paymentMethods, selectedRange, selectedTab],
  );

  /** Render the main screen */
  return (
    <View className="h-full w-full " style={{ backgroundColor: theme.primaryBg }}>
      {/* Tab selection at top */}
      {canViewSubTab && (
        <SubTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(newTab) => {
            setActiveTab(newTab);
            handleClearFilter();
            navigation.setParams({ selectedTab: newTab });
            if (newTab === 'Todays Order') {
              handleTodaysSubtabSelect();
            } else {
              setSelectedRange(initialSelectedDateRange);
            }
          }}
        />
      )}

      {/* Content area */}
      <View className="flex-1 p-4 pb-0">
        <OrderScreenHeader
          handleApplyDate={handleApplyDate}
          onFilterPress={() => setShowFilters(true)}
          orderStatuses={orderStatuses}
          paymentMethods={paymentMethods}
          orderTypes={orderTypes}
          paymentStatuses={paymentStatuses}
          activeTab={activeTab}
          selectedDate={selectedRange}
          forceOrderCard={forceOrderCard}
          onToggleForceOrderCard={() => setForceOrderCard((v) => !v)}
          onRemoveFilter={handleRemoveFilter}
          onOverflowPress={() => setShowFilters(true)}
        />

        {/* If loading, show spinner */}
        {orderScreenState?.status === 'pending' ? (
          <View className="flex-1 items-center justify-center bg-white">
            <FoodPreparationAnimation
              isTabletOrDesktop={isLargeScreen}
              message="Loading Orders ..."
              bottomLine={true}
            />
          </View>
        ) : (
          // Otherwise render the orders (or empty)
          renderOrdersList()
        )}

        {/* Error popup, if any */}
        <NotificationBar
          message={orderScreenState?.error?.message || ''}
          variant="error"
          onClose={() => orderScreenState?.reset?.()}
        />

        {/* Bottom sheet for filters */}
        <FiltersBottomSheetModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          orderStatuses={orderStatuses}
          paymentStatuses={paymentStatuses}
          orderTypes={orderTypes}
          paymentMethods={paymentMethods}
          onApplyFilters={(...p) => {
            handleApplyFilters(...p, selectedRange ? selectedRange : initialSelectedDateRange);
            setShowFilters(false);
          }}
          onClearFilter={() => {
            handleClearFilter();
            setShowFilters(false);
          }}
        />
      </View>
    </View>
  );
}
