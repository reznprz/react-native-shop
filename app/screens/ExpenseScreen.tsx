import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import ExpenseCard from 'app/components/expense/ExpenseCard';
import { useExpenses } from 'app/hooks/useExpenses';
import { ExpenseMetrics } from 'app/components/expense/ExpenseMetrics';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import CustomButton from 'app/components/common/button/CustomButton';
import AddExpenseModal from 'app/components/modal/AddExpenseModal';
import DateHeader from 'app/components/common/DateHeader';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import EmptyState from 'app/components/common/EmptyState';
import NotificationBar from 'app/components/common/NotificationBar';
import CustomIcon from 'app/components/common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import ConfirmationModal from 'app/components/modal/ConfirmationModal';
import { useFocusEffect } from '@react-navigation/native';
import ListHeader from 'app/components/common/ListHeader';

const ExpenseScreen = () => {
  const {
    expenseDetails,
    expenseDescription,
    expenseScreenState,
    addExpenseState,
    deleteExpenseState,
    handleAddExpense,
    fetchExpense,
    handleDeleteExpense,
    getExpenseDescriptionsHandler,
    searchTerm,
    setSearchTerm,
  } = useExpenses();
  const { isLargeScreen } = useIsDesktop();

  const [selectedDate, setSelectedDate] = useState('Today');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [errorNotification, setErrorNotificaton] = useState('');
  const [successNotification, setSuccessNotificaton] = useState('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<number | null>(
    null,
  );

  const { totalExpenses, todayExpenses, thisMonthExpenses, expenses } = expenseDetails;

  useFocusEffect(
    useCallback(() => {
      getExpenseDescriptionsHandler();
    }, []),
  );

  useEffect(() => {
    fetchExpense(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (addExpenseState.status === 'error') {
      setErrorNotificaton(addExpenseState.error?.message || 'Opps Something went wrong!.');
      addExpenseState.reset?.();
    }
    if (addExpenseState.status === 'success') {
      setSuccessNotificaton('New expense added!.');
      addExpenseState.reset?.();
    }
  }, [addExpenseState]);

  useEffect(() => {
    if (deleteExpenseState.status === 'error') {
      setErrorNotificaton(addExpenseState.error?.message || 'Opps Something went wrong!.');
      deleteExpenseState.reset?.();
    }
    if (deleteExpenseState.status === 'success') {
      setSuccessNotificaton('Delete expense success!.');
      deleteExpenseState.reset?.();
    }
  }, [deleteExpenseState]);

  const headerElement = useMemo(
    () => (
      <ListHeader
        title="Recent Expenses"
        searchTerm={searchTerm}
        onSearch={(text) => setSearchTerm(text)}
        searchPlaceholder="Search expenses..."
      />
    ),
    [searchTerm], // only recreate when `searchTerm` changes
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Date Header */}
      <DateHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        activeTab={''}
        handleApplyDate={() => {}}
      />

      {/* Summary Section */}
      <ExpenseMetrics
        totalExpenses={Number(totalExpenses)}
        thisMonthExpenses={Number(thisMonthExpenses)}
        todayExpenses={Number(todayExpenses)}
        isLargeScreen={isLargeScreen}
      />

      {/* Add Expense Button */}
      <View className="flex-row justify-end items-end ml-2 mt-1 mb-6">
        <CustomButton
          title={'+ Add Expense'}
          onPress={() => {
            setShowAddExpenseModal(true);
          }}
          customButtonStyle="w-40 h-12 mr-2 flex items-center justify-center rounded-lg  bg-[#2a4759] shadow-md"
        />
      </View>

      {expenseScreenState?.status === 'pending' ||
      addExpenseState?.status === 'pending' ||
      deleteExpenseState?.status === 'pending' ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !expenses || expenses.length === 0 ? (
        <EmptyState
          iconName="bank"
          message="No Expenses available"
          subMessage="Please select different Date ."
          iconSize={100}
        />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          key={'h'}
          ListHeaderComponent={headerElement}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <View className="px-4">
              <ExpenseCard
                key={item.id}
                title={item.description}
                date={item.expensesDate}
                amount={item.amount}
                quantity={item.quantity}
                iconBgColor={`${item.iconMetadataDetails?.bgColor}`}
                icon={
                  <CustomIcon
                    name={item.iconMetadataDetails?.iconName || ''}
                    type={(item.iconMetadataDetails?.iconType as IconType) || 'Feather'}
                    size={20}
                    color={item.iconMetadataDetails?.filledColor}
                    validate={true}
                  />
                }
                onDelete={() => {
                  setShowDeleteConfirmationModal(item.id);
                }}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        />
      )}

      <AddExpenseModal
        visible={showAddExpenseModal}
        expenseOptions={expenseDescription}
        onRequestClose={() => {
          setShowAddExpenseModal(false);
        }}
        onAddExpense={(value) => {
          handleAddExpense(value);
        }}
      />

      <NotificationBar
        message={errorNotification}
        variant="error"
        onClose={() => setErrorNotificaton('')}
      />

      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />

      <ConfirmationModal
        visible={showDeleteConfirmationModal !== null}
        onRequestClose={() => setShowDeleteConfirmationModal(null)}
        onConfirm={() => {
          // showDeleteConfirmationModal carry the id
          if (showDeleteConfirmationModal) {
            handleDeleteExpense(showDeleteConfirmationModal);
          }
          setShowDeleteConfirmationModal(null);
        }}
        confirmationText="Are you sure you want to delete this item? This action cannot be undone."
      />
    </View>
  );
};

export default ExpenseScreen;
