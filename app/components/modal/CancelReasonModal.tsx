import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { Ionicons } from '@expo/vector-icons';
import ConditionalWrapper from '../common/ConditionalWrapper';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

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
      <Text className="text-lg font-semibold" style={{ color: theme.textPrimary }}>
        Cancel Order
      </Text>
      <Pressable onPress={onRequestClose} className="p-1">
        <Text className="text-xl" style={{ color: theme.textPrimary }}>
          ✕
        </Text>
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
        className={`flex-row items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-150 gap-2 `}
        style={[
          selected
            ? {
                borderColor: theme.secondary,
                backgroundColor: theme.quaternary,
                shadowColor: theme.secondary,
                shadowOpacity: 0.25,
              }
            : {
                borderColor: '#E5E7EB',
                backgroundColor: theme.secondaryBg,
                shadowColor: '#000',
                shadowOpacity: 0.08,
              },
        ]}
      >
        <View className="flex-row items-center space-x-6">
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={selected ? theme.secondary : theme.textTertiary}
            />
          )}{' '}
          <Text
            className="text-base  font-medium ml-2"
            style={[{ color: selected ? theme.textSecondary : theme.textSecondary }]}
          >
            {label}
          </Text>
        </View>
        {selected && <Ionicons name="checkmark-circle" size={24} color={theme.secondary} />}{' '}
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
              <Text className="text-lg font-semibold" style={{ color: theme.textSecondary }}>
                Choose a reason
              </Text>
              {Object.entries(CancelReason).map(([key, value]) => (
                <View key={key} className="p-2">
                  <ReasonOption
                    key={key + value}
                    label={value}
                    value={value}
                    icon={reasonIconMap[key as CancelReasonKeys]}
                  />
                </View>
              ))}
              <View key="CUSTOM" className="p-2">
                <ReasonOption
                  label="Other Reason"
                  value="CUSTOM"
                  icon="chatbubble-ellipses-outline"
                />
              </View>

              {isCustom && (
                <View
                  className="mt-3 rounded-2xl border-2 border-dashed p-4"
                  style={{
                    borderColor: theme.secondary,
                    backgroundColor: theme.primaryBg,
                  }}
                >
                  <Text className="mb-2 text-sm font-medium" style={{ color: theme.secondary }}>
                    Type your custom reason
                  </Text>
                  <TextInput
                    value={customReason}
                    onChangeText={setCustomReason}
                    placeholder="Type here..."
                    multiline
                    autoFocus
                    className="px-4 py-3 rounded-xl text-base min-h-[100px]"
                    style={{
                      backgroundColor: theme.secondaryBg,
                      color: theme.textSecondary,
                    }}
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
