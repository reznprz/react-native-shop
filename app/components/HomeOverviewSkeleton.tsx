import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Platform,
  useWindowDimensions,
  DimensionValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeOverviewSkeleton: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';
  const { width, height } = useWindowDimensions();

  const isTabletOrDesktop = width >= 768;

  // --- Shimmer animation ---
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: useNative,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: useNative,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop?.();
  }, [shimmerAnim, useNative]);

  const cardWidth = isTabletOrDesktop ? (width - 48) / 2 : width - 32;
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth, cardWidth],
  });

  const renderShimmer = () => (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );

  // --- Layout grid ---
  const gap = 16;

  const section = (titleWidth = '45%', barCount = 3, heightFactor = 110, fullWidth = false) => (
    <View
      style={[
        styles.card,
        {
          width: fullWidth ? width - 32 : cardWidth,
          height: heightFactor,
        },
      ]}
    >
      <View style={styles.cardInner}>
        <View />
        <View style={styles.textArea}>
          <View style={[styles.line, { width: titleWidth as DimensionValue }]} />
          {Array.from({ length: barCount }).map((_, i) => (
            <View key={i} style={[styles.line, { width: `${80 - i * 10}%`, marginTop: 10 }]} />
          ))}
        </View>
      </View>
      {renderShimmer()}
    </View>
  );

  // 6 dashboard sections (two-column responsive grid)
  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.gridWrapper,
          {
            width: width - 32,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          },
        ]}
      >
        {/* 4 metric cards — single row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width - 32,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <View
              key={`metric-${i}`}
              style={[
                styles.card,
                {
                  width: (width - 32 - 3 * 12) / 4, // 12px gap between 4 cards
                  height: 90,
                  marginBottom: 0,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                <View
                  style={[
                    styles.line,
                    { width: 32, height: 32, borderRadius: 999, marginRight: 10 },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <View style={[styles.line, { width: '60%', height: 10 }]} />
                  <View style={[styles.line, { width: '40%', height: 14, marginTop: 10 }]} />
                </View>
              </View>
              {renderShimmer()}
            </View>
          ))}
        </View>

        {/* Payment Methods + Daily Sales */}
        {section('40%', 3, 200)}
        {section('55%', 5, 200)}

        {/* Expenses + Top Selling */}
        {section('35%', 5, 200)}
        {section('45%', 5, 200)}

        {/* Inventory */}
        {section('30%', 5, 400, true)}

        {/* Transactions */}
        {section('45%', 3, 150)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 18,
  },
  gridWrapper: {
    alignSelf: 'center',
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
  },
  thumbnail: {
    width: 70,
    height: '90%',
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 14,
  },
  textArea: {
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
});

export default HomeOverviewSkeleton;
