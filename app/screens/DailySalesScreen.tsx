import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, RefreshControl } from 'react-native';

import CustomButton from 'app/components/common/button/CustomButton';
import DateHeader from 'app/components/common/DateHeader';
import NotificationBar from 'app/components/common/NotificationBar';
import SubTab from 'app/components/common/SubTab';
import { DailySalesMetrics } from 'app/components/dailySales/DailySalesMetrics';
import { DateRangeSelection, DateRangeSelectionType } from 'app/components/DateRangePickerModal';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import DailySalesTransactionCard from 'app/components/home/DailySalesTransaction';
import PaymentMethodDistribution from 'app/components/home/PaymentMethodDistribution';
import UpdateOpeningCashModal from 'app/components/modal/UpdateOpeningCashModal';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useRestaurantOverview } from 'app/hooks/useRestaurantOverview';

const tabs = ['Past', 'Todays'];
type TabType = (typeof tabs)[number];

interface DailySalesScreenRouteParams {
  selectedTab?: TabType;
}

interface DailySalesScreenProps {
  route: {
    params: DailySalesScreenRouteParams;
  };
}

const initialSelectedDateRange: DateRangeSelection = {
  selectionType: DateRangeSelectionType.QUICK_RANGE,
  quickRange: { label: 'Last 7 Days', unit: 'days', value: 7 },
};

const DailySalesScreen = ({ route }: DailySalesScreenProps) => {
  const { selectedTab } = route.params || {};
  const {
    dailySalesDetails,
    dailySalesState,
    updateDailySalesState,
    fetchDailySales,
    handleUpdateOpeningCash,
  } = useRestaurantOverview();

  const { isLargeScreen, width } = useIsDesktop();
  const isTablet = width >= 768;

  // State
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'Todays');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection>(initialSelectedDateRange);
  const [isCashModalVisible, setIsCashModalVisible] = useState(false);
  const [errorNotification, setErrorNotificaton] = useState('');
  const [successNotification, setSuccessNotificaton] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Destructure from dailySalesDetails for clarity
  const { paymentMethodDistribution, dailySalesTransaction, totalOverallSales, thisMonth } =
    dailySalesDetails;

  // Fetch sales for "Today" sub-tab
  const handleFetchTodaySales = useCallback(
    (date: string) => {
      fetchDailySales({ selectionType: DateRangeSelectionType.SINGLE_DATE, date });
    },
    [fetchDailySales],
  );

  // Fetch sales for "Past" sub-tab
  const handleFetchPastSales = useCallback(
    (range: DateRangeSelection) => {
      fetchDailySales(range);
    },
    [fetchDailySales],
  );

  // Handler for date change in Today sub-tab
  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
      if (activeTab === 'Todays') {
        handleFetchTodaySales(date);
      }
    },
    [activeTab, handleFetchTodaySales],
  );

  // Handler for applying date range in Past sub-tab
  const handleApplyDate = useCallback(() => {
    if (activeTab === 'Past') {
      handleFetchPastSales(selectedRange);
    }
  }, [activeTab, handleFetchPastSales, selectedRange]);

  // SubTab switch
  const handleTabChange = useCallback(
    (newTab: TabType) => {
      setActiveTab(newTab);
      if (newTab === 'Past') {
        handleFetchPastSales(selectedRange);
      } else {
        handleFetchTodaySales(selectedDate);
      }
    },
    [handleFetchTodaySales, handleFetchPastSales, selectedDate, selectedRange],
  );

  // Pull-down refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'Past') {
      handleFetchPastSales(selectedRange);
    } else {
      handleFetchTodaySales(selectedDate);
    }
    setRefreshing(false);
  }, [activeTab, handleFetchPastSales, handleFetchTodaySales, selectedDate, selectedRange]);

  // Check if there's an error or success upon updating opening cash
  useEffect(() => {
    if (updateDailySalesState.status === 'error') {
      setErrorNotificaton(updateDailySalesState.error?.message || 'Oops! Something went wrong.');
      updateDailySalesState.reset?.();
    }
    if (updateDailySalesState.status === 'success') {
      setSuccessNotificaton('Updated Opening Cash successfully!');
      updateDailySalesState.reset?.();
    }
  }, [updateDailySalesState]);

  // When screen comes into focus, verify the correct tab and fetch data if needed
  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'Past') {
        setActiveTab('Past');
        handleFetchPastSales(selectedRange);
      } else {
        setActiveTab('Todays');
        handleFetchTodaySales(selectedDate);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab, selectedRange, selectedDate]),
  );

  return (
    <View className="h-full w-full bg-gray-100">
      {/* SubTab */}
      <SubTab tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <View className="flex-1 p-4 pb-0">
        {/* Date Header */}
        <DateHeader
          activeTab={activeTab || ''}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          handleApplyDate={handleApplyDate}
        />

        {/* Loading */}
        {dailySalesState?.status === 'pending' || updateDailySalesState?.status === 'pending' ? (
          <FoodLoadingSpinner iconName="coffee" />
        ) : (
          <>
            {/* Daily Sales Metrics */}
            <DailySalesMetrics
              totalOverallSales={totalOverallSales}
              thisMonth={thisMonth}
              today={dailySalesTransaction.totalSales}
              unpaid={dailySalesTransaction.unPaid}
              isLargeScreen={isLargeScreen}
            />

            {activeTab === 'Todays' && (
              <View className="flex-row justify-end items-end ml-2 mt-1 mb-6">
                <CustomButton
                  title="+ Update daily Sales"
                  onPress={() => setIsCashModalVisible(true)}
                  customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg bg-[#2a4759] shadow-md"
                />
              </View>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {/* Payment Methods and Expenses */}
              <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
                {/* Payment Method Distribution */}
                <View
                  style={{ width: isTablet ? '48%' : '100%' }}
                  className="bg-white rounded-lg shadow-sm flex-1"
                >
                  <PaymentMethodDistribution
                    paymentMethods={paymentMethodDistribution}
                    fontSize={18}
                  />
                </View>

                {/* Sales Transactions */}
                <View
                  style={{ width: isTablet ? '48%' : '100%' }}
                  className="bg-white rounded-lg shadow-sm flex-1 mt-4 md:mt-0"
                >
                  <DailySalesTransactionCard
                    title={activeTab === 'Past' ? 'Sales Summary' : 'Daily Sales Summary'}
                    showOpeningAndClosingCash={activeTab === 'Past' ? false : true}
                    salesTransaction={dailySalesTransaction}
                    fontSize={18}
                  />
                </View>
              </View>
            </ScrollView>
          </>
        )}

        {/* Update Opening Cash Modal */}
        <UpdateOpeningCashModal
          visible={isCashModalVisible}
          onRequestClose={() => setIsCashModalVisible(false)}
          currentOpeningCash={dailySalesDetails.dailySalesTransaction.openingCash}
          onUpdateOpeningCash={(updatedAmount) => handleUpdateOpeningCash(updatedAmount)}
        />

        {/* Notification Bars */}
        <NotificationBar
          message={errorNotification}
          variant="error"
          onClose={() => setErrorNotificaton('')}
        />
        <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />
      </View>
    </View>
  );
};

export default DailySalesScreen;
