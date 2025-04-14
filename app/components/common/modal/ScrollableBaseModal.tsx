import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  ModalProps,
} from 'react-native';

interface ScrollableBaseModalProps extends ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

const ScrollableBaseModal: React.FC<ScrollableBaseModalProps> = ({
  visible,
  onRequestClose,
  header,
  body,
  footer,
  ...rest
}) => {
  // Dynamically calculate modal dimensions
  const { width, height } = Dimensions.get('window');
  const modalWidth = Math.min(width * 0.66, 500); // 2/3 of screen width or max 700
  const modalHeight = Math.min(height * 0.5, 500); // 1/2 of screen height or max 600

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      {...rest}
    >
      <View style={styles.backdropContainer}>
        <View style={[styles.modalBox, { width: modalWidth, height: modalHeight }]}>
          {/* Header */}
          {header && <View style={styles.header}>{header}</View>}
          {/* Body wrapped in a ScrollView to enable scrolling if content overflows */}
          {body && (
            <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyScrollContent}>
              <View style={styles.body}>{body}</View>
            </ScrollView>
          )}
          {/* Footer */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </View>
    </Modal>
  );
};

export default ScrollableBaseModal;

const styles = StyleSheet.create({
  backdropContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    // Web-only: add a blur effect behind the modal (cast as any to bypass TypeScript restrictions)
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as any) : {}),
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden', // Keep rounded corners intact
  },
  header: {
    backgroundColor: '#2a4759',
    padding: 18,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    paddingBottom: 12,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footer: {
    padding: 16,
  },
});
