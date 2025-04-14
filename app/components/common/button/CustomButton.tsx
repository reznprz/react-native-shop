import React, { useRef, useState } from 'react';
import {
  Text,
  Pressable,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import CustomIcon from '../CustomIcon';

type SizeOption = 's' | 'm' | 'l' | '2l' | 'xl' | '2xl' | 'full';

export interface CustomButtonProps {
  title: string;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  width?: SizeOption; // Button width options
  height?: SizeOption; // Options: s, m, l, xl, full
  textSize?: string; // Tailwind text size class, e.g., "text-base", "text-lg"
  bgColor?: string; // Background color class. Default is deepTeal (#2a4759)
  textColor?: string; // Text color class. Default is "text-white"
  fontWeight?: string; // Font weight class, e.g., "font-semibold"
  customButtonStyle?: string; // Additional custom style for button container
  customTextStyle?: string; // Additional custom style for text
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  iconType?: IconType;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  buttonType?: 'TouchableOpacity' | 'Normal';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  width = 'm',
  height = 's',
  textSize = 'text-lg',
  bgColor = 'bg-[#2a4759]', // deepTeal default color
  textColor = 'text-white',
  fontWeight = 'font-semibold',
  customButtonStyle,
  customTextStyle,
  iconName,
  iconColor = 'white',
  iconSize = 18,
  iconType = 'Ionicons',
  buttonStyle,
  textStyle,
  buttonType = 'TouchableOpacity',
  ...props
}) => {
  // Map the width prop to a Tailwind width class
  let widthClass = '';
  switch (width) {
    case 's':
      widthClass = 'w-20';
      break;
    case 'm':
      widthClass = 'w-32';
      break;
    case 'l':
      widthClass = 'w-40';
      break;
    case 'xl':
      widthClass = 'w-56';
      break;
    case '2xl':
      widthClass = 'w-56';
      break;
    case 'full':
      widthClass = 'w-full';
      break;
    default:
      widthClass = 'w-32';
  }

  // Map the height prop to Tailwind height classes
  let heightClass = '';
  switch (height) {
    case 's':
      heightClass = 'h-8';
      break;
    case 'm':
      heightClass = 'h-10';
      break;
    case 'l':
      heightClass = 'h-12';
      break;
    case '2l':
      heightClass = 'h-14';
      break;
    case 'xl':
      heightClass = 'h-16';
      break;
    case 'full':
      heightClass = 'h-full';
      break;
    default:
      heightClass = 'h-10';
  }

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {buttonType === 'TouchableOpacity' ? (
        <>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={disabled ? undefined : onPress}
              onPressIn={disabled ? undefined : handlePressIn}
              onPressOut={disabled ? undefined : handlePressOut}
              style={[styles.button, buttonStyle, disabled && styles.disabledButton]}
              {...props}
            >
              <Text style={[styles.text, textStyle]}>{title}</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <>
          <Pressable
            onPress={onPress}
            disabled={disabled}
            className={
              customButtonStyle
                ? `${customButtonStyle} ${bgColor} ${disabled ? 'bg-gray-400' : bgColor} 
                  ${!disabled && 'pressed:bg-[#24415A]'} `
                : `${widthClass} ${heightClass} ${bgColor} ${disabled ? 'bg-gray-400' : bgColor} 
                  ${!disabled && 'pressed:bg-[#24415A]'} 
            flex flex-row items-center justify-center rounded px-2 py-1`
            }
          >
            {iconName && (
              <CustomIcon
                type={iconType}
                name={iconName}
                size={iconSize}
                color={iconColor}
                iconStyle="mr-2"
              />
            )}
            <Text
              className={
                customTextStyle
                  ? customTextStyle
                  : `${textSize} ${textColor} ${fontWeight} text-center`
              }
            >
              {title}
            </Text>
          </Pressable>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2a4759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});

export default CustomButton;
