import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import { Expense } from 'app/api/services/expenseService';
import AutocompleteInput from '../common/AutocompleteInput';
import DateModal from '../common/modal/DateModal';
import ConditionalWrapper from '../common/ConditionalWrapper';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { useTheme } from 'app/hooks/useTheme';

interface AddExpenseModalProps {
  visible: boolean;
  expenseOptions: string[];
  onRequestClose: () => void;
  onAddExpense: (expense: Expense) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  visible,
  expenseOptions,
  onRequestClose,
  onAddExpense,
}) => {
  const theme = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  // Store date as string in "YYYY-MM-DD" format.
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  const showPicker = () => setIsDateModalVisible(true);
  const hidePicker = () => setIsDateModalVisible(false);

  const getPickerDate = () => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const handleAddExpense = () => {
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      setError('Valid amount is required');
      return;
    }
    setError('');
    const expense: Expense = {
      id: 0,
      description,
      amount: parseFloat(amount),
      quantity: parseInt(quantity),
      expensesDate: date,
    };
    onAddExpense(expense);
    resetForm();
    onRequestClose();
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setQuantity('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Header content
  const headerContent = (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-semibold" style={{ color: theme.headerText }}>
        Add New Expense
      </Text>
      <Pressable onPress={onRequestClose} className="p-1">
        <Text className="text-xl" style={{ color: theme.headerText }}>
          ✕
        </Text>
      </Pressable>
    </View>
  );

  // Body content wrapped with the ConditionalWrapper so that keyboard dismissal happens on mobile only.
  const bodyContent = (
    <ConditionalWrapper>
      <View className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          {/* Description Field */}
          <View className="mb-3">
            <Text className="mb-1 text-lg font-semibold" style={{ color: theme.textSecondary }}>
              Description
            </Text>
            <AutocompleteInput
              value={description}
              onChange={setDescription}
              options={expenseOptions}
              placeholder="Enter expense description"
            />
          </View>

          {/* Amount Field */}
          <View className="mb-3">
            <Text className="mb-1 text-lg font-semibold" style={{ color: theme.textSecondary }}>
              Amount
            </Text>
            <TextInput
              className="rounded-md py-3 px-3"
              style={{
                backgroundColor: theme.primaryBg,
                borderColor: theme.icon,
                borderWidth: 1,
                color: theme.textSecondary,
              }}
              placeholder="0.00"
              placeholderTextColor={theme.textTertiary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Quantity Field */}
          <View className="mb-3">
            <Text className="mb-1 text-lg font-semibold" style={{ color: theme.textSecondary }}>
              Quantity
            </Text>
            <TextInput
              className="rounded-md py-3 px-3"
              style={{
                backgroundColor: theme.primaryBg,
                borderColor: theme.icon,
                borderWidth: 1,
                color: theme.textSecondary,
              }}
              placeholder="1"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          {/* Date Field using DateModal */}
          <View className="mb-3">
            <Text className="mb-1 text-lg font-semibold" style={{ color: theme.textSecondary }}>
              Date
            </Text>
            <Pressable
              onPress={showPicker}
              className="rounded-md py-3 px-3"
              style={{
                backgroundColor: theme.primaryBg,
                borderColor: theme.icon,
                borderWidth: 1,
              }}
            >
              <Text style={{ color: theme.textSecondary }}>{date}</Text>
            </Pressable>
          </View>

          <DateModal
            isVisible={isDateModalVisible}
            date={getPickerDate()}
            onConfirm={(selectedDate: string) => {
              setDate(selectedDate);
              hidePicker();
            }}
            onCancel={hidePicker}
            headerTitle="Select a Date"
          />

          {error ? <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} /> : null}
        </KeyboardAvoidingView>
      </View>
    </ConditionalWrapper>
  );

  // Footer content
  const footerContent = (
    <ModalActionsButton
      cancelProps={{
        title: 'Cancel',
        onPress: () => onRequestClose(),
      }}
      actionProps={{
        title: 'Add Expense',
        onPress: () => handleAddExpense(),
      }}
    />
  );

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={headerContent}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default AddExpenseModal;
