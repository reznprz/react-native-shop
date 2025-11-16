import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type SkeletonResponsiveGridProps = {
  rows?: number;
};

const SkeletonResponsiveGrid: React.FC<SkeletonResponsiveGridProps> = ({ rows }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';
  const { width, height } = useWindowDimensions();

  const isTabletOrDesktop = width >= 768;

  // Calculate height-based row count
  const cardHeight = isTabletOrDesktop ? 140 : 110;
  const autoRows = Math.floor((height - 140) / (cardHeight + 16));
  const rowCount = rows ?? Math.max(3, autoRows);

  // Columns
  const columns = isTabletOrDesktop ? 2 : 1;

  // Full width per column
  const cardWidth = columns === 1 ? width - 32 : (width - 48) / 2; // 48 = padding & spacing

  // Animation
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

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth, cardWidth],
  });

  const items = Array.from({ length: rowCount * columns });

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.gridWrapper,
          {
            width: width - 32, // full width minus horizontal padding
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          },
        ]}
      >
        {items.map((_, idx) => (
          <View
            key={idx}
            style={[styles.card, { width: cardWidth, height: cardHeight, marginBottom: 16 }]}
          >
            <View style={styles.cardInner}>
              <View style={styles.thumbnail} />

              <View style={styles.textArea}>
                <View style={[styles.line, { width: '85%' }]} />
                <View style={[styles.line, { width: '70%', marginTop: 10 }]} />
                <View style={[styles.line, { width: '60%', marginTop: 10 }]} />
              </View>
            </View>

            {/* Shimmer */}
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
          </View>
        ))}
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

export default SkeletonResponsiveGrid;
