import React from 'react';
import { View, ActivityIndicator, StyleSheet, GestureResponderEvent } from 'react-native';
import CustomButton, { CustomButtonProps } from './CustomButton';
import ErrorMessagePopUp from '../ErrorMessagePopUp';

export type ButtonState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; reset?: () => void }
  | { status: 'error'; message: string; reset?: () => void };

interface LoadingButtonProps extends CustomButtonProps {
  buttonState: ButtonState;
  onPress: (event: GestureResponderEvent) => void;
  title: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ buttonState, onPress, title, ...rest }) => {
  // Disable button during loading or if successful.
  const isDisabled = buttonState.status === 'loading' || buttonState.status === 'success';

  return (
    <View style={styles.buttonWrapper}>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPress}
          title={buttonState.status === 'loading' ? '' : title}
          disabled={isDisabled}
          {...rest}
        />
        {buttonState.status === 'loading' && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>

      {/* Move inside wrapper so it's stacked below */}
      {buttonState.status === 'error' && (
        <View style={styles.errorWrapper}>
          <ErrorMessagePopUp
            errorMessage={buttonState.message}
            onClose={() => buttonState.reset?.()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
  },
  buttonContainer: {
    position: 'relative',
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorWrapper: {
    marginTop: 8, // space between button and popup
  },
});

export default LoadingButton;
