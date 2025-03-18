import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

interface BaseModalProps {
  visible: boolean;
  onRequestClose: () => void;
  headerTitle?: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onRequestClose,
  headerTitle,
  body,
  footer,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{headerTitle}</Text>
            <Pressable style={styles.closeButton} onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.modalBody}>{body}</View>

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
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Ensures no content goes off-screen
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 12,
    minWidth: Math.min(width - 40, 350), // Responsive width, min 350px or screen width - 40px
    maxWidth: 600, // Prevents excessive width
    flexShrink: 1, // Prevents content overflow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a4759',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1, // Ensures text doesn't push close button out
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  modalBody: {
    width: '100%',
    marginVertical: 15,
  },
  modalFooter: {
    alignItems: 'center',
    padding: 10,
  },
});

export default BaseModal;
