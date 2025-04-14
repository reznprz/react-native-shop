import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import CustomIcon from './common/CustomIcon';

type FoodLoadingSpinnerProps = {
  iconSize?: number;
  iconColor?: string;
  iconBgColor?: string;
  iconName?: string;
  iconType?: IconType;
};

const FoodLoadingSpinner: React.FC<FoodLoadingSpinnerProps> = ({
  iconSize = 40,
  iconColor = '#2a4759',
  iconBgColor = 'rgba(42, 71, 89, 0.1)',
  iconName = 'utensils',
  iconType = 'FontAwesome5',
}) => {
  // If on web, just render a simple ActivityIndicator
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2a4759" />
      </View>
    );
  }

  // On iOS/Android, use the animated spinner
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Rotation Animation
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // Pulse (Opacity) Animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    rotation.start();
    pulse.start();

    // Cleanup on unmount
    return () => {
      rotation.stop();
      pulse.stop();
    };
  }, [rotateAnim, opacityAnim]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ rotate: rotateInterpolation }],
            opacity: opacityAnim,
          },
        ]}
      >
        <CustomIcon type={iconType} name={iconName} size={iconSize} color={iconColor} />
      </Animated.View>
    </View>
  );
};

export default FoodLoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(42, 71, 89, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
