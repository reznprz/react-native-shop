import React, { useRef } from 'react';
import {
  Text,
  Pressable,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import CustomIcon from '../CustomIcon';
import { useTheme } from 'app/hooks/useTheme';

type SizeOption = 's' | 'm' | 'l' | '2l' | 'xl' | '2xl' | 'full';

export interface CustomButtonProps {
  title: string;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  width?: SizeOption;
  height?: SizeOption;
  textSize?: string;
  bgColor?: string;
  textColor?: string;
  fontWeight?: string;
  customButtonStyle?: string;
  customTextStyle?: string;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  iconType?: IconType;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  buttonType?: 'TouchableOpacity' | 'Normal';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  width = 'm',
  height = 's',
  textSize = 'text-lg',
  bgColor, // legacy tailwind classes
  textColor,
  fontWeight = 'font-semibold',
  customButtonStyle,
  customTextStyle,
  iconName,
  iconColor,
  iconSize = 18,
  iconType = 'Ionicons',
  buttonStyle,
  textStyle,
  backgroundColor,
  buttonType = 'TouchableOpacity',
  ...props
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // width + height maps
  const widthMap: Record<SizeOption, string> = {
    s: 'w-20',
    m: 'w-32',
    l: 'w-40',
    '2l': 'w-48',
    xl: 'w-56',
    '2xl': 'w-64',
    full: 'w-full',
  };

  const heightMap: Record<SizeOption, string> = {
    s: 'h-8',
    m: 'h-10',
    l: 'h-12',
    '2l': 'h-14',
    xl: 'h-16',
    '2xl': 'h-20',
    full: 'h-full',
  };

  /** FINAL COLORS based on theme */
  const finalBg = disabled
    ? theme.secondaryBtnBg // disabled bg
    : backgroundColor || theme.buttonBg; // theme button color

  const finalTextColor = disabled ? theme.textTertiary : textColor || theme.textPrimary; // default white on dark buttons

  const finalIconColor = disabled ? theme.textTertiary : iconColor || theme.textPrimary;

  return (
    <>
      {buttonType === 'TouchableOpacity' ? (
        <Animated.View
          style={[{ transform: [{ scale: scaleAnim }] }, disabled && { opacity: 0.6 }]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={disabled ? undefined : onPress}
            onPressIn={disabled ? undefined : handlePressIn}
            onPressOut={disabled ? undefined : handlePressOut}
            style={[styles.button, { backgroundColor: finalBg }, buttonStyle]}
            {...props}
          >
            <View style={styles.rowCenter}>
              {iconName && (
                <CustomIcon
                  type={iconType}
                  name={iconName}
                  size={iconSize}
                  color={finalIconColor}
                  iconStyle="mr-2"
                />
              )}
              <Text style={[styles.text, { color: finalTextColor }, textStyle]}>{title}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          className={
            customButtonStyle
              ? `${customButtonStyle}`
              : `${widthMap[width]} ${heightMap[height]} flex flex-row items-center justify-center rounded px-2 py-1`
          }
          style={{ backgroundColor: finalBg }}
        >
          {iconName && (
            <CustomIcon
              type={iconType}
              name={iconName}
              size={iconSize}
              color={finalIconColor}
              iconStyle="mr-2"
            />
          )}
          <Text
            className={customTextStyle ? customTextStyle : `${textSize} ${fontWeight} text-center`}
            style={{ color: finalTextColor }}
          >
            {title}
          </Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
