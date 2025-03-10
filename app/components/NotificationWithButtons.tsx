import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import CustomIcon from './common/CustomIcon';

interface NotificationProps {
  message: string;
  type?: 'info' | 'error' | 'warning';
  width?: number;
  onClose: () => void;
  onConfirm: () => void;
}

// Screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Cap the notification's max width
const MAX_WIDTH = 500;

const NotificationWithButtons: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  width,
  onClose,
  onConfirm,
}) => {
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
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // for Android
    position: 'absolute',
    top: 90,
    right: 10, // Pin to the right
    zIndex: 9999,
  };

  useEffect(() => {
    // Slide in: from off-screen → 0
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

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
        <span className="text-white font-semibold flex-1">{message}</span>

        {/* NO & YES Buttons */}
        <button className="ml-4 bg-gray-500 text-white px-3 py-1 rounded" onClick={onClose}>
          NO
        </button>
        <button className="ml-2 bg-[#2A4759] text-white px-3 py-1 rounded" onClick={onConfirm}>
          YES
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
      <View className="flex-row justify-between items-center">
        <CustomIcon type="Ionicons" name={icon} size={24} color="#fff" iconStyle="mr-3" />
        <Text style={styles.messageText}>{message}</Text>
      </View>
      {/* Buttons Container */}
      <View className="flex-row mt-2">
        <TouchableOpacity
          style={[styles.button, styles.noButton]}
          onPress={onClose}
          accessibilityLabel="Close notification"
        >
          <Text style={styles.buttonText}>NO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.yesButton]}
          onPress={onConfirm}
          accessibilityLabel="Confirm notification"
        >
          <Text style={styles.buttonText}>YES</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Styles
const styles = StyleSheet.create({
  messageText: {
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  noButton: {
    backgroundColor: '#6B7280', // Neutral gray
    marginRight: 8,
  },
  yesButton: {
    backgroundColor: '#2A4759', // Theme color
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationWithButtons;
