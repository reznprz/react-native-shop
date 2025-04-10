import { useState, useEffect } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

interface DimensionsEvent {
  window: ScaledSize;
  screen: ScaledSize;
}

function determineDeviceType(width: number, height: number) {
  const isWeb = Platform.OS === 'web';
  if (isWeb) {
    // For web, check the user agent if available
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isDesktop = userAgent.includes('Win') || userAgent.includes('Mac');
    return isDesktop ? 'Desktop' : 'Web';
  }
  // For native platforms, consider a simple tablet check based on the smallest dimension.
  const isTablet = Math.min(width, height) >= 768;
  if (Platform.OS === 'ios') return isTablet ? 'iPad' : 'iPhone';
  if (Platform.OS === 'android') return isTablet ? 'Android Tablet' : 'Android Phone';
  return 'Unknown';
}

export function useIsDesktop() {
  // Track window dimensions.
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const handleChange = ({ window }: DimensionsEvent) => {
      setDimensions(window);
    };

    // Subscribe to dimension changes.
    const subscription = Dimensions.addEventListener('change', handleChange);

    // Cleanup the listener. For newer React Native versions, subscription.remove() exists.
    // For older versions, we cast Dimensions to any to call removeEventListener.
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      } else {
        // Casting Dimensions to any bypasses TypeScript checking here.
        (Dimensions as any).removeEventListener('change', handleChange);
      }
    };
  }, []);

  const { width, height } = dimensions;
  const deviceType = determineDeviceType(width, height);
  const isDesktop = width >= 1024;
  const isLargeScreen = width > 768;

  // Calculate numColumns based on the current width.
  let numColumns = 2;
  if (width >= 640 && width < 768) {
    numColumns = 3;
  } else if (width >= 768 && width <= 1024) {
    numColumns = 4;
  } else if (width > 1024 && width < 1366) {
    numColumns = 5;
  } else if (width >= 1366) {
    numColumns = 6;
  }

  const isMobile = deviceType === 'iPhone' || deviceType === 'Android Phone';

  return { deviceType, isDesktop, width, height, isLargeScreen, numColumns, isMobile };
}
