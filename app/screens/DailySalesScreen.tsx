import CustomButton from 'app/components/common/button/CustomButton';
import DateHeader from 'app/components/common/DateHeader';
import NotificationBar from 'app/components/common/NotificationBar';
import { DailySalesMetrics } from 'app/components/dailySales/DailySalesMetrics';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import DailySalesTransactionCard from 'app/components/home/DailySalesTransaction';
import PaymentMethodDistribution from 'app/components/home/PaymentMethodDistribution';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { useRestaurantOverview } from 'app/hooks/useRestaurantOverview';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';

const DailySalesScreen = () => {
  const { dailySalesDetails, dailySalesState, fetchDailySales } = useRestaurantOverview();

  const { isLargeScreen, width } = useIsDesktop();
  const isTablet = width >= 768;

  const [selectedDate, setSelectedDate] = useState('Today');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [errorNotification, setErrorNotificaton] = useState('');
  const [successNotification, setSuccessNotificaton] = useState('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<number | null>(
    null,
  );
  const { paymentMethodDistribution, dailySalesTransaction, totalOverallSales, thisMonth } =
    dailySalesDetails;

  useEffect(() => {
    fetchDailySales(selectedDate);
  }, [selectedDate]);

  //   useEffect(() => {
  //     if (addExpenseState.status === 'error') {
  //       setErrorNotificaton(addExpenseState.error?.message || 'Opps Something went wrong!.');
  //       addExpenseState.reset?.();
  //     }
  //     if (addExpenseState.status === 'success') {
  //       setSuccessNotificaton('New expense added!.');
  //       addExpenseState.reset?.();
  //     }
  //   }, [addExpenseState]);

  //   useEffect(() => {
  //     if (deleteExpenseState.status === 'error') {
  //       setErrorNotificaton(addExpenseState.error?.message || 'Opps Something went wrong!.');
  //       deleteExpenseState.reset?.();
  //     }
  //     if (deleteExpenseState.status === 'success') {
  //       setSuccessNotificaton('Delete expense success!.');
  //       deleteExpenseState.reset?.();
  //     }
  //   }, [deleteExpenseState]);

  if (dailySalesState?.status === 'pending') {
    return <FoodLoadingSpinner iconName="hamburger" />;
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Date Header */}
      <DateHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <DailySalesMetrics
        totalOverallSales={totalOverallSales}
        thisMonth={thisMonth}
        today={dailySalesTransaction.totalSales}
        unpaid={dailySalesTransaction.unPaid}
        isLargeScreen={isLargeScreen}
      />

      {/* Update Button */}
      <View className="flex-row justify-end items-end ml-2 mt-1 mb-6">
        <CustomButton
          title={'+ Update daily Sales'}
          onPress={() => {
            setShowAddExpenseModal(true);
          }}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {/* Payment Methods and Expenses - Equal Height Pair */}
      <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
        <View
          style={{ width: isTablet ? '48%' : '100%' }}
          className="bg-white rounded-lg shadow-sm flex-1"
        >
          <PaymentMethodDistribution paymentMethods={paymentMethodDistribution} />
        </View>
        <View
          style={{ width: isTablet ? '48%' : '100%' }}
          className="bg-white rounded-lg shadow-sm flex-1 mt-4 md:mt-0"
        >
          <DailySalesTransactionCard salesTransaction={dailySalesTransaction} />
        </View>
      </View>

      <NotificationBar
        message={errorNotification}
        variant="error"
        onClose={() => setErrorNotificaton('')}
      />

      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />
    </View>
  );
};

export default DailySalesScreen;
