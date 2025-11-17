import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'app/hooks/useTheme';

type FoodPreparationAnimationProps = {
  isTabletOrDesktop: boolean;
  floatAnim?: Animated.Value;
  message: string;
  hint?: string;
  /** Compact mode for small containers like table cards */
  compact?: boolean;
  bottomLine?: boolean;
};

const FoodPreparationAnimation: React.FC<FoodPreparationAnimationProps> = React.memo(
  ({ isTabletOrDesktop, floatAnim, message, hint, compact = false, bottomLine = false }) => {
    const theme = useTheme();
    const internalAnim = useRef(new Animated.Value(0)).current;
    const anim = floatAnim ?? internalAnim;
    const useNative = Platform.OS !== 'web';

    useEffect(() => {
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

    // Sizes tuned for compact vs normal
    const baseSize = compact ? 28 : isTabletOrDesktop ? 58 : 54;
    const heroSize = compact ? 34 : isTabletOrDesktop ? 66 : 62;
    const iconSize = compact ? 16 : isTabletOrDesktop ? 28 : 26;

    const trayWidth = compact ? 130 : isTabletOrDesktop ? 240 : 214;
    const trayHeight = compact ? 22 : isTabletOrDesktop ? 48 : 42;
    const trayBottom = compact ? 4 : isTabletOrDesktop ? 12 : 10;

    const messageFontSize = compact ? 11 : isTabletOrDesktop ? 14 : 13;
    const messageMarginTop = compact ? 4 : isTabletOrDesktop ? 12 : 10;

    const cookBounce1 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -6, 0],
    });
    const cookScale1 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.03, 1],
    });

    const cookBounce2 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-3, 3, -3],
    });
    const cookScale2 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1.01, 1.05, 1.01],
    });

    const cookBounce3 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -5, 0],
    });
    const cookScale3 = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.02, 1],
    });

    const trayBorder = theme.borderColor ?? '#E5E7EB';
    const trayBackground = theme.quaternary;
    const trayTintLine = theme.quaternary;

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: compact ? 2 : isTabletOrDesktop ? 14 : 10,
        }}
      >
        {/* Tray */}
        {!bottomLine ? (
          <View
            style={{
              position: 'absolute',
              bottom: trayBottom,
              width: trayWidth,
              height: trayHeight,
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
            {/* Top highlight line */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 10,
                right: 10,
                height: 1,
                backgroundColor: trayTintLine,
                opacity: 0.12,
              }}
            />
          </View>
        ) : (
          <View
            style={{
              position: 'absolute',
              bottom: -4,
              left: 20,
              right: 20,
              height: 3,
              backgroundColor: theme.secondary,
              borderRadius: 2,
              opacity: 0.9,
            }}
          />
        )}

        {/* Icons */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
                marginHorizontal: 4,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.secondaryBg,
                borderWidth: 1,
                borderColor: theme.quaternary,
              }}
            >
              <MaterialCommunityIcons
                name="pot-steam-outline"
                size={iconSize}
                color={theme.quaternary}
              />
            </View>
          </Animated.View>

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
                marginHorizontal: 4,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.secondary,
                borderWidth: 2,
                borderColor: theme.quaternary,
              }}
            >
              <MaterialCommunityIcons
                name="food-variant"
                size={iconSize + 2}
                color={theme.textPrimary}
              />
            </View>
          </Animated.View>

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
                marginHorizontal: 4,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.secondaryBg,
                borderWidth: 1,
                borderColor: theme.quaternary,
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

        {/* Message */}
        <Text
          style={{
            marginTop: messageMarginTop,
            fontSize: messageFontSize,
            fontWeight: '600',
            color: theme.textSecondary,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {message}
        </Text>

        {hint && !compact && (
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
