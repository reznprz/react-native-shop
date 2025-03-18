import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import { Expense } from 'app/api/services/expenseService';
import AutocompleteInput from '../common/AutocompleteInput';

const expenseOptions = [
  'Groceries',
  'Restaurant',
  'Coffee',
  'Travel',
  'Utilities',
  'Entertainment',
  'Medical',
  'Clothing',
  'Education',
];

interface AddExpenseModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onAddExpense: (expense: Expense) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  visible,
  onRequestClose,
  onAddExpense,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleAddExpense = () => {
    // Validation
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      setError('Valid amount is required');
      return;
    }

    setError(''); // Clear error if valid

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

  // Define header content
  const headerContent = (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Add New Expense</Text>
      <Pressable onPress={onRequestClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </Pressable>
    </View>
  );

  // Define body content
  const bodyContent = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.bodyContainer} // Added a style here if needed
    >
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <AutocompleteInput
          value={description}
          onChange={setDescription}
          options={expenseOptions}
          placeholder="Enter expense description"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {error ? <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} /> : null}
    </KeyboardAvoidingView>
  );

  // Define footer content
  const footerContent = (
    <View style={styles.footerContainer}>
      <Pressable onPress={onRequestClose} style={[styles.button, styles.cancelButton]}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
      <Pressable onPress={handleAddExpense} style={[styles.button, styles.addButton]}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </Pressable>
    </View>
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

const styles = StyleSheet.create({
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  // Body container (optional)
  bodyContainer: {
    // If the parent or modal sets overflow: 'hidden', suggestions can get clipped.
    // Use overflow: 'visible' or remove overflow constraints in ScrollableBaseModal if needed.
  },
  // Field styles
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  // Footer styles
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2a4759',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
