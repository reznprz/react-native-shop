import React, { ReactNode, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Animated,
  BackHandler,
  PanResponder,
} from 'react-native';

interface BaseBottomSheetModalProps {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
  /** Allow swipe-down to close (default: true) */
  enableSwipeClose?: boolean;
}

export const BaseBottomSheetModal: React.FC<BaseBottomSheetModalProps> = ({
  visible,
  onClose,
  children,
  enableSwipeClose = true,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible && onClose) {
        onClose();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  useEffect(() => {
    if (visible) {
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

  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => enableSwipeClose && (g.dy > 6 || g.vy > 0.2),
      onPanResponderMove: (_, g) => {
        if (!enableSwipeClose) return;
        const y = Math.max(0, g.dy);
        pan.setValue(y);
      },
      onPanResponderRelease: (_, g) => {
        if (!enableSwipeClose) return;
        if (g.dy > 120 || g.vy > 0.8) {
          onClose?.();
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          {...(enableSwipeClose ? panResponder.panHandlers : {})}
          style={[
            styles.sheet,
            {
              transform: [
                { translateY },
                { translateY: pan }, // pan stacks on the spring
              ],
            },
          ]}
        >
          {/* drag handle */}
          <View style={styles.handle} />
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    marginVertical: 8,
  },
});
