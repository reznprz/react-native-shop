import React from 'react';
import { View, Text, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'app/hooks/useTheme';

type PreparingKitchenStatusProps = {
  isTabletOrDesktop: boolean;
  isWeb: boolean;
  floatAnim: Animated.Value;
};

const PreparingKitchenStatus: React.FC<PreparingKitchenStatusProps> = ({
  isTabletOrDesktop,
  isWeb,
  floatAnim,
}) => {
  const theme = useTheme();

  // Bouncing animations derived from shared floatAnim
  const cookBounce1 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const cookBounce2 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 5],
  });
  const cookBounce3 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View
      className="items-center"
      accessible
      accessibilityLiveRegion="polite"
      style={{ marginTop: isTabletOrDesktop ? 22 : 18 }}
    >
      {/* “Preparing food” cooking line */}
      <View className="flex-row items-center justify-center mb-2">
        <Animated.View
          style={{
            transform: [{ translateY: cookBounce1 }],
          }}
        >
          <View
            style={{
              width: isTabletOrDesktop ? 58 : 54,
              height: isTabletOrDesktop ? 58 : 54,
              borderRadius: 999,
              marginHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.primaryBg,
            }}
          >
            <MaterialCommunityIcons
              name="pot-steam-outline"
              size={isTabletOrDesktop ? 28 : 26}
              color={theme.secondary}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: cookBounce2 }],
          }}
        >
          <View
            style={{
              width: isTabletOrDesktop ? 62 : 58,
              height: isTabletOrDesktop ? 62 : 58,
              borderRadius: 999,
              marginHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.secondary,
            }}
          >
            <MaterialCommunityIcons
              name="food-variant"
              size={isTabletOrDesktop ? 28 : 26}
              color={theme.primaryBg}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: cookBounce3 }],
          }}
        >
          <View
            style={{
              width: isTabletOrDesktop ? 58 : 54,
              height: isTabletOrDesktop ? 58 : 54,
              borderRadius: 999,
              marginHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.primaryBg,
            }}
          >
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={isTabletOrDesktop ? 28 : 26}
              color={theme.secondary}
            />
          </View>
        </Animated.View>
      </View>

      <Text
        className="text-xs text-center"
        style={{
          color: theme.textSecondary,
          marginTop: 6,
          fontSize: isTabletOrDesktop ? 13 : 12,
        }}
      >
        The kitchen is warming up your data…
      </Text>

      {/* subtle checklist-style steps */}
      <View className="w-full px-2" style={{ marginTop: isTabletOrDesktop ? 16 : 12 }}>
        <View className="flex-row items-center mb-1.5">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: theme.secondary }}
          />
          <Text className="text-[11px]" style={{ color: theme.textSecondary }}>
            Loading menu & categories
          </Text>
        </View>
        <View className="flex-row items-center mb-1.5">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: theme.mutedIcon }}
          />
          <Text className="text-[11px]" style={{ color: theme.textSecondary }}>
            Preparing tables & floor view
          </Text>
        </View>
        <View className="flex-row items-center">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: theme.mutedIcon }}
          />
          <Text className="text-[11px]" style={{ color: theme.textSecondary }}>
            Fetching today&apos;s sales summary
          </Text>
        </View>
      </View>

      <Text
        className="text-[11px] text-center"
        style={{
          color: theme.mutedIcon,
          marginTop: isTabletOrDesktop ? 14 : 10,
        }}
      >
        {isWeb
          ? 'This may take a few seconds on slower connections.'
          : 'Hang tight — your workspace is almost ready.'}
      </Text>
    </View>
  );
};

export default PreparingKitchenStatus;
