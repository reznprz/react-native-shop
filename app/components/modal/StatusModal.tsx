import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ContactStatus } from 'app/api/services/restaurantService';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { useTheme } from 'app/hooks/useTheme';

interface StatusModalProps {
  visible: boolean;
  selected: ContactStatus;
  onSelect: (status: ContactStatus) => void;
  onRequestClose: () => void;
}

const ALL_STATUSES: ContactStatus[] = [ContactStatus.PRIMARY, ContactStatus.SECONDARY];

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  selected,
  onSelect,
  onRequestClose,
}) => {
  const theme = useTheme();

  const footerContent = (
    <ModalActionsButton
      cancelProps={{
        title: 'Cancel',
        onPress: onRequestClose,
      }}
      actionProps={{
        title: 'Done',
        onPress: onRequestClose,
      }}
    />
  );

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
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
            className="w-full max-w-[360px] bg-white rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <View
              style={{ backgroundColor: theme.secondary, padding: 12 }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold">Change Status</Text>
              <Pressable onPress={onRequestClose} className="p-1">
                <Text className="text-white text-xl">✕</Text>
              </Pressable>
            </View>

            {/* Body */}
            <View className="px-5 pt-4 pb-4 mb-4">
              {ALL_STATUSES.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => onSelect(status)}
                  className={`w-full py-3 px-4 mb-2 rounded-xl ${
                    status === selected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: status === selected ? theme.quaternary : theme.primaryBg,
                  }}
                >
                  <Text
                    style={{
                      color: status === selected ? theme.primary : theme.textSecondary,
                      fontWeight: status === selected ? '600' : '400',
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Footer */}
            <View className="px-5 pb-3">{footerContent}</View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default StatusModal;
