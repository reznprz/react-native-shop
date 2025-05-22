import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  StyleSheet,
  View,
  TextInput,
  ViewStyle,
} from 'react-native';
import CustomIcon from './common/CustomIcon';
import ErrorMessagePopUp from './common/ErrorMessagePopUp';

interface NotificationProps {
  message: string;
  type?: 'info' | 'error' | 'warning';
  width?: number;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

// Screen dimensions & max width for the notification container
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_WIDTH = 500;

const NotificationWithButtons: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  width,
  onClose,
  onConfirm,
}) => {
  // Responsive container width: either user provided or 90% of the screen up to 500px
  const containerWidth = width || Math.min(SCREEN_WIDTH * 0.9, MAX_WIDTH);

  // Slide animation value: start off-screen (containerWidth + extra offset)
  const slideAnim = useRef(new Animated.Value(containerWidth + 50)).current;

  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');

  const notificationStyles = {
    info: {
      backgroundColor: '#506D82',
      accentColor: '#a0c4dc',
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

  const mobileContainerStyle: ViewStyle = {
    width: containerWidth,
    backgroundColor,
    borderLeftWidth: 24,
    borderLeftColor: accentColor,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: 140,
    right: 10,
    zIndex: 9999,
  };

  // Trigger slide-in animation on mount
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // If no message, render nothing
  if (!message) return null;

  const handleConfirm = () => {
    if (note.trim().length === 0) {
      setNoteError('Please enter a note');
    } else {
      setNoteError('');
      onConfirm(note);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <div
        className={`
          absolute top-5 right-2 z-50
          flex flex-col p-4 rounded-lg shadow-lg
          border-l-4
          w-[${containerWidth}px]
          animate-slideIn
        `}
        style={{
          backgroundColor: backgroundColor as string,
          borderLeftColor: accentColor,
        }}
      >
        <div className="flex flex-row items-center">
          <CustomIcon type="Ionicons" name={icon} size={24} color="#fff" iconStyle="mr-3" />
          <span className="text-white font-semibold flex-1">{message}</span>
        </div>
        {/* Note Input */}
        <input
          type="text"
          placeholder="Enter note..."
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (e.target.value.trim().length > 0) setNoteError('');
          }}
          className="mt-3 p-2 rounded border border-gray-300 text-black"
        />
        {noteError && <span className="text-red-500 text-sm mt-1">{noteError}</span>}
        {/* Buttons Container */}
        <div className="flex flex-row mt-3">
          <button
            className="ml-4 bg-gray-500 text-white px-3 py-1 rounded hover:opacity-90 transition"
            onClick={onClose}
          >
            NO
          </button>
          <button
            className="ml-2 bg-[#2A4759] text-white px-3 py-1 rounded hover:opacity-90 transition"
            onClick={handleConfirm}
          >
            YES
          </button>
        </div>
      </div>
    );
  }

  return (
    <Animated.View style={[mobileContainerStyle, { transform: [{ translateX: slideAnim }] }]}>
      <View className="flex-row justify-between items-center">
        <CustomIcon type="Ionicons" name={icon} size={24} color="#fff" iconStyle="mr-3" />
        <Text style={styles.messageText}>{message}</Text>
      </View>
      {/* Note Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter note..."
        placeholderTextColor="#999"
        value={note}
        onChangeText={(text) => {
          setNote(text);
          if (text.trim().length > 0) setNoteError('');
        }}
      />
      {noteError ? (
        <ErrorMessagePopUp
          errorMessage={noteError}
          onClose={() => {
            setNoteError('');
          }}
          containerStyle={{ margin: 8, padding: 4, width: '85%' }}
        />
      ) : null}
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
          onPress={handleConfirm}
          accessibilityLabel="Confirm notification"
        >
          <Text style={styles.buttonText}>YES</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Styles for mobile
const styles = StyleSheet.create({
  messageText: {
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
    fontSize: 16,
  },
  input: {
    width: '80%',
    backgroundColor: '#FFF',
    color: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 12,
    alignSelf: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  noButton: {
    backgroundColor: '#6B7280',
    marginRight: 8,
  },
  yesButton: {
    backgroundColor: '#2A4759',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationWithButtons;
