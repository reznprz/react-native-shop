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
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

  const handleAdd = () => {
    if (value.trim()) {
      onSave();
    }
  };

  const footerContent = (
    <ModalActionsButton
      cancelProps={{
        title: 'Cancel',
        onPress: onRequestClose,
      }}
      actionProps={{
        title: 'Add',
        onPress: handleAdd,
      }}
    />
  );

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
      {/* backdrop */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className="flex-1 justify-center items-center px-6"
          style={{
            backgroundColor: theme.backdrop,
            ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as any) : {}),
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="w-full max-w-[360px] rounded-2xl overflow-hidden"
            style={{ backgroundColor: theme.secondaryBg }}
          >
            {/* Header */}
            <View
              className="flex-row justify-between items-center"
              style={{ backgroundColor: theme.secondary, padding: 12 }}
            >
              <Text style={{ color: theme.textPrimary }} className="text-lg font-semibold">
                {title}
              </Text>
              <Pressable onPress={onRequestClose} className="p-1">
                <Text style={{ color: theme.textPrimary }} className="text-xl">
                  ✕
                </Text>
              </Pressable>
            </View>

            {/* Body */}
            <View className="px-5 pt-4 pb-4 mb-4">
              <Text className="text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>
                {placeholder}
              </Text>

              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={
                  placeholder.toLowerCase().includes('phone') ? 'phone-pad' : 'email-address'
                }
                autoCapitalize="none"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.secondaryBg,
                  color: theme.textSecondary,
                }}
                className="w-full border rounded-xl px-4 py-2 text-base"
                placeholderTextColor={theme.mutedIcon}
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
