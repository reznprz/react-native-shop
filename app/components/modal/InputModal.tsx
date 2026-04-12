import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
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

  const keyboardType = placeholder.toLowerCase().includes('phone') ? 'phone-pad' : 'default';

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          backgroundColor: theme.backdrop,
          ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as any) : {}),
        }}
      >
        {/* Backdrop click area */}
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onRequestClose();
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            width: '100%',
            maxWidth: 380,
          }}
        >
          {/* Modal card */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
            }}
            style={{
              width: '100%',
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: theme.secondaryBg,
              ...(Platform.OS === 'web'
                ? ({
                    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                  } as any)
                : {
                    elevation: 8,
                  }),
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.secondary,
                padding: 12,
              }}
            >
              <Text
                style={{
                  color: theme.textPrimary,
                  fontSize: 18,
                  fontWeight: '600',
                  flex: 1,
                }}
              >
                {title}
              </Text>

              <Pressable
                onPress={onRequestClose}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginLeft: 12,
                }}
              >
                <Text style={{ color: theme.textPrimary, fontSize: 20 }}>✕</Text>
              </Pressable>
            </View>

            {/* Body */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 16,
              }}
            >
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                  fontWeight: '500',
                  marginBottom: 6,
                }}
              >
                {placeholder}
              </Text>

              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={theme.mutedIcon}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: theme.borderColor,
                  backgroundColor: theme.secondaryBg,
                  color: theme.textSecondary,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: Platform.OS === 'web' ? 12 : 10,
                  fontSize: 16,
                  outlineStyle: 'none' as any,
                }}
              />
            </View>

            {/* Footer */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 14,
              }}
            >
              {footerContent}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default InputModal;
