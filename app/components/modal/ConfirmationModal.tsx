import React from 'react';
import { View, Text, Pressable } from 'react-native';
import BaseModal from '../common/modal/BaseModal';
import ModalActionsButton from '../common/modal/ModalActionsButton';

interface ConfirmationModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  confirmationText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onRequestClose,
  onConfirm,
  confirmationText,
}) => {
  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      headerTitle="Confirmation"
      body={
        <View className="px-6 py-4">
          <Text className="text-center text-gray-800 text-lg">{confirmationText}</Text>
        </View>
      }
      footer={
        <ModalActionsButton
          cancelProps={{
            title: 'No',
            onPress: () => onRequestClose(),
          }}
          actionProps={{
            title: 'Yes',
            onPress: () => onConfirm(),
          }}
        />
      }
    />
  );
};

export default ConfirmationModal;
