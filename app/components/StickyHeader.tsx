import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import useHeaderConfig from '../hooks/useHeaderConfig';
import { useNavigation } from 'app/hooks/useNavigation';
import { TabRouteName } from 'app/types/navigation';

interface StickyHeaderProps extends NativeStackHeaderProps {
  currentTabName?: TabRouteName;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ navigation, route, currentTabName }) => {
  const { goToCartScreen } = useNavigation();
  const { width } = useWindowDimensions();

  // Determine header dimensions based on screen width
  const headerHeight = width <= 768 ? 100 : 80;
  const paddingTop = width <= 768 ? 50 : 8;

  console.log('route', route);

  // Get header configuration
  const { displayedTitle, showBackArrow, showCart } = useHeaderConfig(route, currentTabName);

  console.log('displayedTitle', displayedTitle);

  // Determine the title to display
  const title = displayedTitle === 'BottomTabs' ? 'Home' : displayedTitle;

  return (
    <View
      style={{ height: headerHeight, paddingTop }}
      className="bg-deepTeal border-b border-gray-200"
    >
      <View className="flex-row items-center m-4">
        {/* Back Arrow */}
        {showBackArrow && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text className="text-xl font-bold text-white flex-1 text-center" numberOfLines={1}>
          {title}
        </Text>

        {/* Cart Icon */}
        {showCart && (
          <TouchableOpacity
            onPress={goToCartScreen}
            className="ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="cart-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(StickyHeader);
