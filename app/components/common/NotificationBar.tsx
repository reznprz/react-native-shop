import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Easing,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

type NotificationBarProps = {
  variant?: 'success' | 'info' | 'warn' | 'error';
  message?: string;
  autoClose?: boolean;
  duration?: number;
  topPosition?: number;
  onClose?: () => void;
};

type VariantConfig = {
  backgroundColor: string;
  icon: string;
};

const variants: Record<NonNullable<NotificationBarProps['variant']>, VariantConfig> = {
  success: {
    backgroundColor: '#2a4759',
    icon: '✓',
  },
  info: {
    backgroundColor: '#3b82f6',
    icon: 'ℹ️',
  },
  warn: {
    backgroundColor: '#3b82f6',
    icon: '⚠️',
  },
  error: {
    backgroundColor: '#ef4444',
    icon: '✖️',
  },
};

const NotificationBar: FC<NotificationBarProps> = ({
  variant = 'success',
  message,
  autoClose = true,
  duration = 5000,
  topPosition = 50,
  onClose,
}) => {
  // If message is null, undefined, or empty, skip rendering altogether
  const hasMessage = message && message.trim().length > 0;

  const [visible, setVisible] = useState<boolean>(false);

  // Slide in/out animation
  const slideAnim = useRef<Animated.Value>(new Animated.Value(windowWidth)).current;

  // Progress bar animation
  const progressAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  // Whenever the message changes:
  //  - If we have a valid message, reset the animations and slide in again
  //  - If not, hide immediately
  useEffect(() => {
    if (!hasMessage) {
      // If there's no message, hide the bar
      setVisible(false);
      return;
    }

    // We have a new message:
    setVisible(true);

    // Reset the slide & progress
    slideAnim.setValue(windowWidth);
    progressAnim.setValue(0);

    // Slide in from right to left
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Animate progress bar from 0% to 100% over `duration` ms
    Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false, // we need layout updates for the width
    }).start();

    // Set up auto-close timer if enabled
    if (autoClose) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [message, hasMessage, autoClose, duration, slideAnim, progressAnim]);

  const handleClose = () => {
    // Slide out to the right
    Animated.timing(slideAnim, {
      toValue: windowWidth,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose?.();
    });
  };

  // Return null if not visible or if there's no valid message
  if (!visible || !hasMessage) return null;

  // Grab variant styling
  const { backgroundColor, icon } = variants[variant];

  // Interpolate the progress width from 0% -> 100%
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: (windowWidth - 420) / 1.02,
          right: 16,
          width: 420,
          transform: [{ translateX: slideAnim }],
          backgroundColor,
          top: topPosition,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      {/* Progress bar at the bottom */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
    </Animated.View>
  );
};

export default NotificationBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,

    // Subtle shadow for an elegant look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    marginRight: 8,
    fontSize: 16,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
  },
  closeButton: {
    marginLeft: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
