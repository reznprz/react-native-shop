import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useOrder } from 'app/hooks/useOrder';

import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import OrderScreenHeader from 'app/components/common/OrderScreenHeader';
import SubTab from 'app/components/common/SubTab';

import OrderCard from 'app/components/order/OrderCard';
import OrderMetrics from 'app/components/OrderMetrics';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';

import { navigate } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';

import { removedFilter } from 'app/components/filter/filter';
import { OrderDetails } from 'app/api/services/orderService';
import { DateRangeSelection, DateRangeSelectionType } from 'app/components/DateRangePickerModal';
import { FiltersBottomSheetModal } from 'app/components/filter/FiltersBottomSheetModal';
import NotificationBar from 'app/components/common/NotificationBar';

const tabs = ['Past Orders', 'Todays Order'];
type TabType = (typeof tabs)[number];

interface OrdersScreenRouteParams {
  selectedTab?: TabType;
}

interface OrdersScreenProps {
  route: {
    params: OrdersScreenRouteParams;
  };
}

const initialSelectedDateRange: DateRangeSelection = {
  selectionType: DateRangeSelectionType.QUICK_RANGE,
  quickRange: { label: 'Last 7 Days', unit: 'days', value: 7 },
};

export default function OrdersScreen({ route }: OrdersScreenProps) {
  const { selectedTab } = route.params || {};

  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'Todays Order');

  const { isLargeScreen } = useIsDesktop();

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

  // /**
  //  * If you'd like to re-fetch whenever the screen is focused,
  //  * do so with the official `useFocusEffect`.
  //  */
  // useFocusEffect(
  //   useCallback(() => {
  //     if (selectedRange) {
  //       handleDateSelect(selectedRange);
  //     }
  //     // Dependencies = [] means it runs once on focus
  //   }, []),
  // );

  // fetch todays orders
  const handleTodaysSubtabSelect = useCallback(() => {
    handleDateSelect({ selectionType: DateRangeSelectionType.SINGLE_DATE, date: 'Today' });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'Past Orders') {
        setActiveTab('Past Orders');
        setSelectedRange(selectedRange);
      } else {
        setActiveTab('Todays Order');
        handleTodaysSubtabSelect();
      }
    }, [selectedTab]),
  );

  /** Called when user selects an order from the list (e.g., on phone). */
  const handleOrderPress = useCallback((order: OrderDetails) => {
    navigate(ScreenNames.ORDER_DETAILS, { orderId: order.orderId.toString() });
  }, []);

  /** Called for "More Actions" on an order. */
  const handleMoreActionPress = useCallback((order: OrderDetails) => {
    navigate(ScreenNames.ORDER_DETAILS, {
      orderId: order.orderId.toString(),
      actionType: 'More Action',
    });
  }, []);

  /** Pull-to-refresh logic. */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedRange) {
      await handleDateSelect(selectedRange);
    }
    setRefreshing(false);
  }, [selectedRange]);

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
        <OrderMetrics
          totalAmount={totalAmount}
          paidAmount={paidAmount}
          unpaidAmount={unpaidAmount}
          totalOrders={totalOrders}
          isLargeScreen={isLargeScreen}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {activeTab === 'Todays Order' ? (
            <View className={`flex-1 gap-1 ${isLargeScreen ? 'flex-row flex-wrap' : ''}`}>
              {orders.map((order) =>
                isLargeScreen ? (
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
            // "Past Orders" or anything else
            <View className={`flex gap-1 ${isLargeScreen ? 'flex-row flex-wrap' : ''}`}>
              {orders.map((order) => (
                <TouchableOpacity key={order.orderId} onPress={() => handleOrderPress(order)}>
                  <OrderSummaryCard order={order} showTable={false} />
                </TouchableOpacity>
              ))}
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
    [orderStatuses, paymentStatuses, orderTypes, paymentMethods, selectedRange],
  );

  /** Render the main screen */
  return (
    <View className="h-full w-full bg-gray-100">
      {/* Tab selection at top */}
      <SubTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(newTab) => {
          if (newTab === 'Todays Order') {
            handleTodaysSubtabSelect();
          } else {
            if (selectedRange) {
              setSelectedRange(selectedRange);
            } else {
              setSelectedRange(initialSelectedDateRange);
            }
          }
          setActiveTab(newTab);
        }}
      />

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
          onRemoveFilter={handleRemoveFilter}
          onOverflowPress={() => setShowFilters(true)}
        />

        {/* If loading, show spinner */}
        {orderScreenState?.status === 'pending' ? (
          <FoodLoadingSpinner iconName="coffee" />
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
