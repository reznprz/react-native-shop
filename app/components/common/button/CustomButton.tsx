import React, { useState } from 'react';
import {
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

type SizeOption = 's' | 'm' | 'l' | 'xl' | 'full';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  width?: SizeOption; // Button width options
  height?: SizeOption; // Options: s, m, l, xl, full
  textSize?: string; // Tailwind text size class, e.g., "text-base", "text-lg"
  bgColor?: string; // Background color class. Default is deepTeal (#2a4759)
  textColor?: string; // Text color class. Default is "text-white"
  fontWeight?: string; // Font weight class, e.g., "font-semibold"
  customButtonStyle?: StyleProp<ViewStyle>; // Additional custom style for button container
  customTextStyle?: StyleProp<TextStyle>; // Additional custom style for text
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  width = 'm',
  height = 'l',
  textSize = 'text-lg',
  bgColor = 'bg-[#2a4759]', // deepTeal default color
  textColor = 'text-white',
  fontWeight = 'font-semibold',
  customButtonStyle,
  customTextStyle,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
    case 'xl':
      heightClass = 'h-16';
      break;
    case 'full':
      heightClass = 'h-full';
      break;
    default:
      heightClass = 'h-10';
  }

  // Define a hover effect by slightly modifying the background color.
  // Here, when hovered, we use a slightly altered deepTeal shade.
  const hoverEffect = 'hover:bg-[#24415A]';

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      className={
        `${widthClass} ${heightClass} ${bgColor} ${hoverEffect} rounded px-4 py-2 ${customButtonStyle}` // allow custom override
      }
    >
      <Text className={`${textSize} ${textColor} ${fontWeight} text-center ${customTextStyle}`}>
        {title}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
