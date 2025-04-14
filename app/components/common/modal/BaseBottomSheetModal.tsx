import React, { ReactNode, useRef, useEffect } from 'react';
import { Modal, StyleSheet, View, Pressable, GestureResponderEvent, Animated } from 'react-native';

interface BaseBottomSheetModalProps {
  visible: boolean;
  onClose?: (event?: GestureResponderEvent) => void;
  children: ReactNode;
}

export const BaseBottomSheetModal: React.FC<BaseBottomSheetModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, overlayOpacity]);

  if (!visible) {
    // If not visible, we can return null to avoid rendering anything
    // Alternatively, you can rely on the Modal controlling that for you
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Dark overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Bottom sheet container */}
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
});
