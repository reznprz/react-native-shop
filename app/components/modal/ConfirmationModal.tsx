import React from 'react';
import { View, Text, Pressable } from 'react-native';
import BaseModal from '../common/modal/BaseModal';

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
        <View className="flex-row justify-between">
          <Pressable
            onPress={onRequestClose}
            className="flex-1 py-4 rounded-md mx-1 items-center justify-center bg-gray-200"
          >
            <Text className="text-gray-800 font-medium">No</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            className="flex-1 py-4 rounded-md mx-1 items-center justify-center bg-[#2a4759]"
          >
            <Text className="text-white font-medium">Yes</Text>
          </Pressable>
        </View>
      }
    />
  );
};

export default ConfirmationModal;
