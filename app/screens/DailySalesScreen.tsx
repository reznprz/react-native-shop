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
import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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

const DailySalesScreen = ({ route }: DailySalesScreenProps) => {
  const {
    dailySalesDetails,
    dailySalesState,
    updateDailySalesState,
    fetchDailySales,
    handleUpdateOpeningCash,
  } = useRestaurantOverview();
  const { selectedTab } = route.params || {};

  const { isLargeScreen, width } = useIsDesktop();
  const isTablet = width >= 768;

  const [selectedDate, setSelectedDate] = useState('Today');
  const [isCashModalVisible, setIsCashModalVisible] = useState(false);
  const [errorNotification, setErrorNotificaton] = useState('');
  const [successNotification, setSuccessNotificaton] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(selectedTab ?? 'Todays');
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection>({
    selectionType: DateRangeSelectionType.SINGLE_DATE,
    date: 'Today',
  });

  const { paymentMethodDistribution, dailySalesTransaction, totalOverallSales, thisMonth } =
    dailySalesDetails;

  useEffect(() => {
    fetchDailySales(selectedDate);
  }, [selectedDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDailySales(selectedDate);
    setRefreshing(false);
  }, [fetchDailySales]);

  useEffect(() => {
    if (updateDailySalesState.status === 'error') {
      setErrorNotificaton(updateDailySalesState.error?.message || 'Opps Something went wrong!.');
      updateDailySalesState.reset?.();
    }
    if (updateDailySalesState.status === 'success') {
      setSuccessNotificaton('Updated Opening Cash Success!.');
      updateDailySalesState.reset?.();
    }
  }, [updateDailySalesState]);

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'Past') {
        setActiveTab('Past');
        setSelectedRange({
          selectionType: DateRangeSelectionType.QUICK_RANGE,
          quickRange: { label: 'Last 7 Days', unit: 'days', value: 7 },
        });
      } else {
        setActiveTab('Todays');
        setSelectedRange({ selectionType: DateRangeSelectionType.SINGLE_DATE, date: 'Today' });
      }
    }, [selectedTab]),
  );

  return (
    <View className="h-full w-full bg-gray-100">
      <SubTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(newTab) => {
          if (newTab === 'Todays Order') {
            setSelectedRange({ selectionType: DateRangeSelectionType.SINGLE_DATE, date: 'Today' });
          } else {
            setSelectedRange({
              selectionType: DateRangeSelectionType.QUICK_RANGE,
              quickRange: { label: 'Last 7 Days', unit: 'days', value: 7 },
            });
          }
          setActiveTab(newTab);
        }}
      />

      <View className="flex-1 p-4 pb-0">
        {/* Date Header */}
        <DateHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />

        {dailySalesState?.status === 'pending' || updateDailySalesState?.status === 'pending' ? (
          <FoodLoadingSpinner iconName="coffee" />
        ) : (
          <>
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
                  title={'+ Update daily Sales'}
                  onPress={() => {
                    setIsCashModalVisible(true);
                  }}
                  customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
                />
              </View>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {/* Payment Methods and Expenses */}
              <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
                <View
                  style={{ width: isTablet ? '48%' : '100%' }}
                  className="bg-white rounded-lg shadow-sm flex-1"
                >
                  <PaymentMethodDistribution
                    paymentMethods={paymentMethodDistribution}
                    fontSize={18}
                  />
                </View>
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

        <UpdateOpeningCashModal
          visible={isCashModalVisible}
          onRequestClose={() => setIsCashModalVisible(false)}
          currentOpeningCash={dailySalesDetails.dailySalesTransaction.openingCash}
          onUpdateOpeningCash={(updatedAmount) => handleUpdateOpeningCash(updatedAmount)}
        />

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
