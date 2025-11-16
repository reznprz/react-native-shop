import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import ErrorMessagePopUp from '../common/ErrorMessagePopUp';
import ConditionalWrapper from '../common/ConditionalWrapper';
import BaseModal from '../common/modal/BaseModal';
import ModalActionsButton from '../common/modal/ModalActionsButton';

interface UpdateOpeningCashModalProps {
  visible: boolean;
  onRequestClose: () => void;
  currentOpeningCash: number;
  onUpdateOpeningCash: (updatedCash: number) => void;
}

const UpdateOpeningCashModal: React.FC<UpdateOpeningCashModalProps> = ({
  visible,
  onRequestClose,
  currentOpeningCash,
  onUpdateOpeningCash,
}) => {
  const [openingCash, setOpeningCash] = useState(currentOpeningCash.toFixed(2));
  const [error, setError] = useState('');

  const handleUpdate = () => {
    if (!openingCash.trim() || isNaN(parseFloat(openingCash))) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    onUpdateOpeningCash(parseFloat(openingCash));
    onRequestClose();
  };

  const bodyContent = (
    <ConditionalWrapper>
      <View className="m-2">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="m-2"
        >
          {/* Opening Cash Input */}
          <View>
            <Text className="mb-2 text-lg text-gray-800">Opening Cash Amount</Text>
            <TextInput
              className="bg-gray-100 rounded-md py-3 px-3 border border-gray-300"
              placeholder="Enter Opening Cash"
              keyboardType="decimal-pad"
              value={openingCash}
              onChangeText={setOpeningCash}
            />
          </View>

          {error ? <ErrorMessagePopUp errorMessage={error} onClose={() => setError('')} /> : null}
        </KeyboardAvoidingView>
      </View>
    </ConditionalWrapper>
  );

  const footerContent = (
    <ModalActionsButton
      cancelProps={{
        title: 'Cancel',
        onPress: () => onRequestClose(),
      }}
      actionProps={{
        title: 'Update ',
        onPress: () => handleUpdate(),
      }}
    />
  );

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      headerTitle="Update Opening Cash"
      body={bodyContent}
      footer={footerContent}
      bodyStyle={{ marginVertical: 15 }}
    />
  );
};

export default UpdateOpeningCashModal;
