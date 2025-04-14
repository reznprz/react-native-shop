import React from 'react';
import { View, ViewStyle } from 'react-native';
import CustomButton from '../button/CustomButton';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  fontWeight?: 'normal' | 'bold' | '500' | '600';
  buttonStyle?: ViewStyle;
  textStyle?: ViewStyle;
}

interface ModalActionsButtonProps {
  cancelProps: ButtonProps;
  actionProps: ButtonProps;
  containerStyle?: ViewStyle;
}

const ModalActionsButton: React.FC<ModalActionsButtonProps> = ({
  cancelProps,
  actionProps,
  containerStyle = {},
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        height: 45,
        ...containerStyle,
      }}
    >
      <View style={{ flex: 1 }}>
        <CustomButton
          title={cancelProps.title || 'Cancel'}
          onPress={cancelProps.onPress}
          buttonStyle={{
            width: '100%',
            backgroundColor: cancelProps.backgroundColor || '#e5e7eb',
            ...cancelProps.buttonStyle,
          }}
          textStyle={{
            color: cancelProps.textColor || '#1f2937',
            fontWeight: cancelProps.fontWeight || '500',
            ...cancelProps.textStyle,
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <CustomButton
          title={actionProps.title || 'Confirm'}
          onPress={actionProps.onPress}
          buttonStyle={{
            width: '100%',
            backgroundColor: actionProps.backgroundColor || '#2a4759',
            ...actionProps.buttonStyle,
          }}
          textStyle={{
            color: actionProps.textColor || '#ffffff',
            fontWeight: actionProps.fontWeight || '600',
            ...actionProps.textStyle,
          }}
        />
      </View>
    </View>
  );
};

export default ModalActionsButton;
