import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomIcon from './common/CustomIcon';

interface NotificationProps {
  message: string;
  type?: 'info' | 'error' | 'warning';
  width?: number;
  onClose: () => void;
}

// Screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Cap the notification's max width
const MAX_WIDTH = 500;

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', width, onClose }) => {
  // 1) Determine the container width: either user-provided or 90% of screen up to 500
  const containerWidth = width || Math.min(SCREEN_WIDTH * 0.9, MAX_WIDTH);

  // 2) Start the notification off-screen (e.g. containerWidth + 50 to the right)
  const slideAnim = useRef(new Animated.Value(containerWidth + 50)).current;

  // Define colors/icons by type
  const notificationStyles = {
    info: {
      backgroundColor: '#3B82F6',
      accentColor: '#2563EB',
      icon: 'information-circle-outline',
    },
    error: {
      backgroundColor: '#EF4444',
      accentColor: '#DC2626',
      icon: 'close-circle-outline',
    },
    warning: {
      backgroundColor: '#F59E0B',
      accentColor: '#D97706',
      icon: 'warning-outline',
    },
  };

  const { backgroundColor, accentColor, icon } = notificationStyles[type];

  // ====== Mobile Styles (RN) ======
  const mobileContainerStyle: ViewStyle = {
    width: containerWidth,
    backgroundColor,
    borderLeftWidth: 6,
    borderLeftColor: accentColor,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // for Android
    position: 'absolute',
    top: 20,
    right: 10, // Pin to the right
    zIndex: 9999,
  };

  // ====== Animation & Auto-Close ======
  useEffect(() => {
    // Slide in: from off-screen → 0
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Auto-close after 5 seconds → slide it out & then onClose
    const autoCloseTimer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: containerWidth + 50,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onClose());
    }, 5000);

    // Cleanup when unmounting or re-rendering
    return () => {
      clearTimeout(autoCloseTimer);
    };
  }, [slideAnim, onClose, containerWidth]);

  if (!message) return null;

  // ====== WEB ======
  if (Platform.OS === 'web') {
    return (
      <div
        className={`
          absolute top-5 right-2 z-50
          flex items-center p-4 rounded-lg shadow-lg
          border-l-4
          w-[${containerWidth}px]
          animate-slideIn
        `}
        style={{
          backgroundColor: backgroundColor as string,
          borderLeftColor: accentColor,
        }}
      >
        <CustomIcon type="Ionicons" name={icon} size={24} color="#fff" iconStyle="mr-3" />
        <span
          style={{
            color: '#FFF',
            fontWeight: 600,
            flex: 1,
          }}
        >
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            marginLeft: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Close notification"
        >
          <Ionicons name="close-sharp" size={24} color="#ffffff" />
        </button>
      </div>
    );
  }

  // ====== MOBILE (iOS/Android) ======
  return (
    <Animated.View
      style={[
        mobileContainerStyle,
        {
          // 3) Translate from (containerWidth + 50) → 0
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <CustomIcon type="Ionicons" name={icon} size={24} color="#fff" iconStyle="mr-3" />
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity
        onPress={() => {
          // Manual close → slide it out, then call onClose
          Animated.timing(slideAnim, {
            toValue: containerWidth + 50,
            duration: 400,
            useNativeDriver: true,
          }).start(() => onClose());
        }}
        style={styles.closeButton}
        accessibilityLabel="Close notification"
      >
        <Ionicons name="close-sharp" size={24} color="#ffffff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Optional styles for text, button, etc.
const styles = StyleSheet.create({
  messageText: {
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    marginLeft: 12,
  },
});

export default Notification;
