import { useState, useEffect } from 'react';
import { Dimensions, Platform, useWindowDimensions } from 'react-native';

// Function to determine the device type
function determineDeviceType(width: number, height: number) {
  const isWeb = Platform.OS === 'web';
  const isDesktop =
    isWeb && (navigator.userAgent.includes('Win') || navigator.userAgent.includes('Mac'));
  const isTablet = Math.min(width, height) >= 768; // Tablets have a min width of 768px

  if (isDesktop) return 'Desktop';
  if (isWeb) return 'Web';
  if (Platform.OS === 'ios') return isTablet ? 'iPad' : 'iPhone';
  if (Platform.OS === 'android') return isTablet ? 'Android Tablet' : 'Android Phone';

  return 'Unknown';
}

// Custom hook to get the device type
export function useIsDesktop() {
  const { width, height } = useWindowDimensions(); // Ensure dimensions are available
  const [deviceType, setDeviceType] = useState(() => determineDeviceType(width, height));
  const [isDesktop, setIsDesktop] = useState(width >= 1024);

  useEffect(() => {
    setDeviceType(determineDeviceType(width, height));
    setIsDesktop(width >= 1024);
  }, [width, height]);

  return { deviceType, isDesktop, width, height };
}
