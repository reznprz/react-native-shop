import React, { ReactNode } from 'react';
import { Modal, StyleSheet, View, Pressable, GestureResponderEvent } from 'react-native';

interface BaseBottomSheetModalProps {
  visible: boolean;
  onClose?: (event?: GestureResponderEvent) => void;
  children: ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
}

export const BaseBottomSheetModal: React.FC<BaseBottomSheetModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
}) => {
  return (
    <Modal visible={visible} transparent animationType={animationType} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Pressing outside the sheet closes it (if onClose is provided) */}
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.sheet}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // no black overlay here
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  sheet: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    minHeight: 300,
    maxHeight: '80%',
  },
});
