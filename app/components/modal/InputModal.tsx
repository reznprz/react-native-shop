import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ModalActionsButton from '../common/modal/ModalActionsButton';

interface InputModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onRequestClose: () => void;
}

const InputModal: React.FC<InputModalProps> = ({
  visible,
  title,
  placeholder,
  value,
  onChangeText,
  onSave,
  onRequestClose,
}) => {
  const handleAdd = () => {
    if (value.trim()) {
      onSave();
    }
  };

  const footerContent = (
    <ModalActionsButton
      cancelProps={{
        title: 'Cancel',
        onPress: () => onRequestClose(),
      }}
      actionProps={{
        title: 'Add',
        onPress: () => handleAdd(),
      }}
    />
  );

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="w-full max-w-[360px] bg-white rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <View
              style={{ backgroundColor: '#2a4759', padding: 12 }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold">{title}</Text>
              <Pressable onPress={onRequestClose} className="p-1">
                <Text className="text-white text-xl">✕</Text>
              </Pressable>
            </View>

            {/* Body */}
            <View className="px-5 pt-4 pb-4 mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">{placeholder}</Text>
              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={
                  placeholder.toLowerCase().includes('phone') ? 'phone-pad' : 'email-address'
                }
                autoCapitalize="none"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base text-gray-900 bg-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Footer */}
            <View className="px-5 pb-3">{footerContent}</View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InputModal;
