import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

interface ConditionalWrapperProps {
  children: React.ReactNode;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({ children }) => {
  if (Platform.OS === 'web') {
    return <View>{children}</View>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default ConditionalWrapper;
