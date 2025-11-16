import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'app/hooks/useTheme';

type FoodPreparationAnimationProps = {
  isTabletOrDesktop: boolean;
  /** Optional external animation value. If not provided, this component will create its own. */
  floatAnim?: Animated.Value;
  /** Main message shown under the animation, e.g. "Loading orders..." */
  message: string;
  /** Optional secondary hint, e.g. "This may take a few seconds." */
  hint?: string;
};

const FoodPreparationAnimation: React.FC<FoodPreparationAnimationProps> = React.memo(
  ({ isTabletOrDesktop, floatAnim, message, hint }) => {
    const theme = useTheme();
    const internalAnim = useRef(new Animated.Value(0)).current;
    const anim = floatAnim ?? internalAnim;
    const useNative = Platform.OS !== 'web'; // avoid native-driver issues on web

    useEffect(() => {
      // If parent passed an external Animated.Value, do NOT run our own loop
      if (floatAnim) return;

      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(internalAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: useNative,
          }),
          Animated.timing(internalAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: useNative,
          }),
        ]),
      );

      loop.start();

      return () => {
        internalAnim.stopAnimation();
        // @ts-ignore
        loop.stop?.();
      };
    }, [floatAnim, internalAnim, useNative]);

    const baseSize = isTabletOrDesktop ? 58 : 54;
    const heroSize = isTabletOrDesktop ? 66 : 62;
    const iconSize = isTabletOrDesktop ? 28 : 26;

    // Motion (smooth bounce + subtle scale)
    const cookBounce1 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -10, 0],
    });
    const cookScale1 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.04, 1],
    });

    const cookBounce2 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-4, 4, -4],
    });
    const cookScale2 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1.02, 1.07, 1.02],
    });

    const cookBounce3 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -8, 0],
    });
    const cookScale3 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.03, 1],
    });

    // Elegant tray colors based on your blue theme
    const trayBorder = theme.borderColor ?? '#E5E7EB';
    const trayBackground = theme.quaternary; // white
    const trayTintLine = theme.quaternary; // subtle top accent

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: isTabletOrDesktop ? 14 : 10,
          // NOTE: no flex-1, no bg-white – let parent control layout/background
        }}
      >
        {/* Elegant tray capsule */}
        <View
          style={{
            position: 'absolute',
            bottom: isTabletOrDesktop ? 12 : 10,
            width: isTabletOrDesktop ? 240 : 214,
            height: isTabletOrDesktop ? 48 : 42,
            borderRadius: 999,
            backgroundColor: trayBackground,
            borderWidth: 1,
            borderColor: trayBorder,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 4,
            elevation: 1,
            overflow: 'hidden',
          }}
        >
          {/* subtle top highlight line */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 12,
              right: 12,
              height: 1,
              backgroundColor: trayTintLine,
              opacity: 0.12,
            }}
          />
        </View>

        {/* Icon Row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Left icon */}
          <Animated.View
            style={{
              transform: [{ translateY: cookBounce1 }, { scale: cookScale1 }],
            }}
          >
            <View
              style={{
                width: baseSize,
                height: baseSize,
                borderRadius: 999,
                marginHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.secondaryBg,
                borderWidth: 1.2,
                borderColor: theme.quaternary,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              }}
            >
              <MaterialCommunityIcons
                name="pot-steam-outline"
                size={iconSize}
                color={theme.quaternary}
              />
            </View>
          </Animated.View>

          {/* Center / hero icon */}
          <Animated.View
            style={{
              transform: [{ translateY: cookBounce2 }, { scale: cookScale2 }],
            }}
          >
            <View
              style={{
                width: heroSize,
                height: heroSize,
                borderRadius: 999,
                marginHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.secondary,
                borderWidth: 2,
                borderColor: theme.quaternary,
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name="food-variant"
                size={iconSize + 4}
                color={theme.textPrimary}
              />
            </View>
          </Animated.View>

          {/* Right icon */}
          <Animated.View
            style={{
              transform: [{ translateY: cookBounce3 }, { scale: cookScale3 }],
            }}
          >
            <View
              style={{
                width: baseSize,
                height: baseSize,
                borderRadius: 999,
                marginHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.secondaryBg,
                borderWidth: 1.2,
                borderColor: theme.quaternary,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              }}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={iconSize}
                color={theme.quaternary}
              />
            </View>
          </Animated.View>
        </View>

        {/* Main message */}
        <Text
          style={{
            marginTop: isTabletOrDesktop ? 12 : 10,
            fontSize: isTabletOrDesktop ? 14 : 13,
            fontWeight: '600',
            color: theme.textSecondary,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>

        {/* Optional hint */}
        {hint && (
          <Text
            style={{
              marginTop: 4,
              fontSize: 11,
              color: theme.mutedIcon,
              textAlign: 'center',
              maxWidth: 280,
            }}
          >
            {hint}
          </Text>
        )}
      </View>
    );
  },
);

export default FoodPreparationAnimation;
