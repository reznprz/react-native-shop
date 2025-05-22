import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import ConditionalWrapper from '../common/ConditionalWrapper';
import InputField from '../common/InputField';
import { RestaurantTableInfo } from 'app/api/services/tableService';

interface AddUpdateTableModalProps {
  table: RestaurantTableInfo | null;
  visible: boolean;
  onClose: () => void;
  onAddUpdateTable: (table: RestaurantTableInfo) => void;
}

const AddUpdateTableModal: React.FC<AddUpdateTableModalProps> = ({
  table,
  visible,
  onClose,
  onAddUpdateTable,
}) => {
  const [tableName, setTableName] = useState(table?.tableName || '');
  const [capacity, setCapacity] = useState(table?.capacity.toString() || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (table) {
      setTableName(table.tableName);
      setCapacity(table.capacity.toString());
    } else {
      setTableName('');
      setCapacity('');
    }
    setError('');
  }, [table]);

  const resetForm = useCallback(() => {
    setCapacity('');
    setTableName('');
    setError('');
  }, []);

  const onRequestClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const validate = useCallback((): boolean => {
    const numericValue = Number(capacity);

    // Check if capacity contains only digits (optional: allow trimming spaces)
    const isOnlyDigits = /^\d+$/.test(capacity.toString().trim());

    if (!isOnlyDigits) {
      setError('Capacity must be a valid number');
      return false;
    }

    if (numericValue <= 0) {
      setError('Capacity must be greater than 0');
      return false;
    }

    setError('');
    return true;
  }, [capacity]);

  const handleAddUpdateTable = useCallback(() => {
    if (!validate()) return;

    const newTable: RestaurantTableInfo = {
      id: table?.id || 0,
      tableName: tableName.trim(),
      capacity: Number(capacity),
    };

    onAddUpdateTable(newTable);
    resetForm();
    onRequestClose();
  }, [validate, tableName, capacity, onAddUpdateTable, resetForm, onRequestClose]);

  const header = useMemo(
    () => (
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-semibold">
          {table ? 'Update Table' : 'Add New Table'}
        </Text>
        <Pressable onPress={onRequestClose} className="p-1">
          <Text className="text-white text-xl">✕</Text>
        </Pressable>
      </View>
    ),
    [onRequestClose],
  );

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={header}
      body={
        <ConditionalWrapper>
          <View className="flex-1">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              className="flex-1"
            >
              <InputField
                label="Table Name"
                value={tableName}
                onChange={setTableName}
                placeholder=""
                keyboardType="default"
              />
              <InputField
                label="Capacity"
                value={capacity}
                onChange={setCapacity}
                placeholder="Enter capacity"
                keyboardType="numeric"
                maxLength={5}
              />

              {error ? (
                <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} />
              ) : null}
            </KeyboardAvoidingView>
          </View>
        </ConditionalWrapper>
      }
      footer={
        <ModalActionsButton
          cancelProps={{ title: 'Cancel', onPress: onRequestClose }}
          actionProps={{ title: 'Save Table', onPress: handleAddUpdateTable }}
        />
      }
    />
  );
};

export default AddUpdateTableModal;
