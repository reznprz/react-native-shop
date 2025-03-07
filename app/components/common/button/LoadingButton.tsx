import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, GestureResponderEvent } from 'react-native';
import CustomButton, { CustomButtonProps } from './CustomButton';
import ErrorMessagePopUp from '../ErrorMessagePopUp';

export type ButtonState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
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
    <>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPress}
          // When loading, show an empty title so our spinner is visible.
          title={buttonState.status === 'loading' ? '' : title}
          disabled={isDisabled}
          {...rest}
        />
        {buttonState.status === 'loading' && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        )}
      </View>
      {buttonState.status === 'error' && (
        <ErrorMessagePopUp
          errorMessage={buttonState.message}
          onClose={() => {
            if (buttonState.reset) {
              buttonState.reset();
            }
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default LoadingButton;
