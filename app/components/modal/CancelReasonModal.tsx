import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { Ionicons } from '@expo/vector-icons';
import ConditionalWrapper from '../common/ConditionalWrapper';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';

export const CancelReason = {
  CUSTOMER_CHANGED_MIND: 'Customer Changed Mind',
  ORDER_ENTRY_MISTAKE: 'Order Entry Mistake',
} as const;

export type CancelReasonKeys = keyof typeof CancelReason;

interface CancelReasonModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: (reason: string) => void;
}

const reasonIconMap: Record<CancelReasonKeys, keyof typeof Ionicons.glyphMap> = {
  CUSTOMER_CHANGED_MIND: 'people-circle-outline',
  ORDER_ENTRY_MISTAKE: 'create-outline',
};

const CancelReasonModal: React.FC<CancelReasonModalProps> = ({
  visible,
  onRequestClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  const isCustom = selectedReason === 'CUSTOM';

  const handleConfirm = () => {
    const finalReason = isCustom ? customReason.trim() : selectedReason;
    if (finalReason) {
      onConfirm(finalReason);
      // Reset state for subsequent openings
      setSelectedReason(null);
      setCustomReason('');
    }
  };

  const headerContent = (
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-semibold">Cancel Order</Text>
      <Pressable onPress={onRequestClose} className="p-1">
        <Text className="text-white text-xl">✕</Text>
      </Pressable>
    </View>
  );

  const ReasonOption = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon?: keyof typeof Ionicons.glyphMap;
  }) => {
    const selected = selectedReason === value;
    return (
      <Pressable
        onPress={() => setSelectedReason(value)}
        className={`flex-row items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-150 gap-2 ${
          selected
            ? 'border-blue-600 shadow-lg shadow-blue-100 bg-blue-50/80'
            : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
        }`}
      >
        <View className="flex-row items-center space-x-6">
          {icon && <Ionicons name={icon} size={22} color={selected ? '#2563eb' : '#6b7280'} />}
          <Text className="text-base text-gray-800 font-medium ml-2">{label}</Text>
        </View>
        {selected && <Ionicons name="checkmark-circle" size={24} color="#2563eb" />}
      </Pressable>
    );
  };

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={headerContent}
      body={
        <ConditionalWrapper>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            <View className="px-6 py-4 space-y-5">
              <Text className="text-lg font-semibold text-gray-900">Choose a reason</Text>

              {Object.entries(CancelReason).map(([key, value]) => (
                <View className="p-2">
                  <ReasonOption
                    key={key}
                    label={value}
                    value={value}
                    icon={reasonIconMap[key as CancelReasonKeys]}
                  />
                </View>
              ))}
              <View className="p-2">
                <ReasonOption
                  label="Other Reason"
                  value="CUSTOM"
                  icon="chatbubble-ellipses-outline"
                />
              </View>

              {isCustom && (
                <View className="mt-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/30 p-4">
                  <Text className="mb-2 text-sm font-medium text-blue-800">
                    Type your custom reason
                  </Text>
                  <TextInput
                    value={customReason}
                    onChangeText={setCustomReason}
                    placeholder="Type here..."
                    multiline
                    autoFocus
                    className="bg-white/80 px-4 py-3 rounded-xl text-base text-gray-900 min-h-[100px]"
                  />
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </ConditionalWrapper>
      }
      footer={
        <ModalActionsButton
          cancelProps={{
            title: 'Close',
            onPress: onRequestClose,
          }}
          actionProps={{
            title: 'Submit',
            onPress: handleConfirm,
          }}
        />
      }
    />
  );
};

export default CancelReasonModal;
