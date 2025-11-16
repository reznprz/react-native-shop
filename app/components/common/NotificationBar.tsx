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
import { useTheme } from 'app/hooks/useTheme';

const windowWidth = Dimensions.get('window').width;
const MAX_BAR_WIDTH = 420;
const HORIZONTAL_MARGIN = 16;

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

const NotificationBar: FC<NotificationBarProps> = ({
  variant = 'success',
  message,
  autoClose = true,
  duration = 5000,
  topPosition = 50,
  onClose,
}) => {
  const theme = useTheme();

  const hasMessage = !!message?.trim();
  const [visible, setVisible] = useState(false);

  // barWidth = screen minus margins, capped at MAX_BAR_WIDTH
  const barWidth = Math.min(MAX_BAR_WIDTH, windowWidth - HORIZONTAL_MARGIN * 2);

  // Animated values
  const slideAnim = useRef(new Animated.Value(barWidth + HORIZONTAL_MARGIN)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const variants: Record<NonNullable<NotificationBarProps['variant']>, VariantConfig> = {
    success: { backgroundColor: theme.secondary, icon: '✓' },
    info: { backgroundColor: theme.quaternary, icon: 'ℹ️' },
    warn: { backgroundColor: theme.tertiary, icon: '⚠️' },
    error: { backgroundColor: theme.errorBg, icon: '✖️' },
  };

  useEffect(() => {
    if (!hasMessage) {
      setVisible(false);
      return;
    }

    setVisible(true);

    // reset positions
    slideAnim.setValue(barWidth + HORIZONTAL_MARGIN);
    progressAnim.setValue(0);

    // slide in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // progress fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // auto-close
    if (autoClose) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [message, hasMessage, autoClose, duration, slideAnim, progressAnim, barWidth]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: barWidth + HORIZONTAL_MARGIN,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose?.();
    });
  };

  if (!visible || !hasMessage) return null;

  const { backgroundColor, icon } = variants[variant];
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: barWidth,
          right: HORIZONTAL_MARGIN,
          top: topPosition,
          backgroundColor,
          transform: [{ translateX: slideAnim }],
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});
