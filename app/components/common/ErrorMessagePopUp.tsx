import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ErrorMessagePopUpProps {
  errorMessage: string;
  onClose: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const ErrorMessagePopUp: React.FC<ErrorMessagePopUpProps> = ({
  errorMessage,
  onClose,
  containerStyle,
  textStyle,
}) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <View style={[styles.errorContainer, containerStyle]}>
      <View style={styles.errorIconContainer}>
        <Text style={styles.errorIconText}>{'!'}</Text>
      </View>
      <Text style={[styles.errorText, textStyle]}>{errorMessage}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>{'×'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a4759', // Your brand color
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000', // Shadow (for iOS)

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 2, // Elevation (for Android)
  },
  errorIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red', // Filled red background for the icon
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  errorIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    flex: 1, // Take up remaining space so text can wrap
    fontSize: 16,
    color: '#ffffff', // High contrast against #2a4759
  },
  closeButton: {
    marginLeft: 16,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ffffff', // Matches the text color
    fontWeight: 'bold',
  },
});

export default ErrorMessagePopUp;
