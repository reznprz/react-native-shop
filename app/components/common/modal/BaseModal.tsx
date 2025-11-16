import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

interface BaseModalProps {
  visible: boolean;
  onRequestClose: () => void;
  headerTitle?: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onRequestClose,
  headerTitle,
  style,
  body,
  footer,
  bodyStyle = { width: '100%', marginVertical: 15 },
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={[styles.modalBackdrop, { backgroundColor: theme.backdrop }]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.primaryBg }, style]}>
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{headerTitle}</Text>

            <Pressable
              style={[styles.closeButton, { backgroundColor: theme.secondaryBg }]}
              onPress={onRequestClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View style={bodyStyle}>{body}</View>

          {/* Footer */}
          {footer && <View style={styles.modalFooter}>{footer}</View>}
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as any) : {}),
  },
  modalContainer: {
    padding: 0,
    borderRadius: 12,
    minWidth: Math.min(width - 40, 350),
    maxWidth: 600,
    flexShrink: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
  },
  modalFooter: {
    alignItems: 'center',
    padding: 10,
  },
});

export default BaseModal;
