import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import { tabScreenConfigs } from '../../navigation/screenConfigs';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import CustomIcon from '../common/CustomIcon';

/** Helper: Get the label from route name */
function getRouteLabel(routeName: string): string {
  const match = tabScreenConfigs.find((s) => s.name === routeName);
  return match ? match.label : routeName;
}

interface CustomHeaderProps {
  route: RouteProp<Record<string, object | undefined>, string>;
  navigation: any;
}

export default function CustomHeader({ route, navigation }: CustomHeaderProps) {
  const { isDesktop, deviceType } = useIsDesktop();

  const desktop = isDesktop && deviceType === 'Desktop';

  const activeRouteName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const title = getRouteLabel(activeRouteName);

  return (
    <View
      className={`
        w-full flex-row items-center justify-between px-8 bg-deepTeal
        ${isDesktop ? 'h-20' : 'h-28'}
      `}
    >
      {/* Left Section: Title */}
      <Text
        className={`
          text-lightCream text-2xl font-anticSlab
          ${isDesktop ? 'pt-6' : 'pt-16'}
        `}
      >
        {title}
      </Text>

      {/* Center Section: Icons (Only for Desktop) */}
      {desktop && (
        <View className="absolute left-1/2 -translate-x-1/2 flex-row space-x-6">
          {tabScreenConfigs.map((screen) => (
            <IconWithTooltip
              key={screen.name}
              navigation={navigation}
              screen={screen}
              isFocused={screen.name === activeRouteName} // Determine if it's selected
            />
          ))}
        </View>
      )}

      {/* Right Section: Table Icon */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MainTabs', {
            screen: 'Table',
            params: { selectedTab: 'Table Items' },
          })
        }
      >
        <CustomIcon
          iconStyle={`${isDesktop ? 'pt-6' : 'pt-16'}`}
          name={'table'}
          type={'MaterialCommunityIcons'}
          size={30}
          color="#fef6eb"
        />
      </TouchableOpacity>
    </View>
  );
}

/** ✅ Icon Component with Selection Logic */
const IconWithTooltip = ({ navigation, screen, isFocused }: any) => {
  const [hovered, setHovered] = useState(false);

  // Choose correct icon & color based on selection
  const iconName = isFocused ? screen.filledIcon : screen.icon;
  const iconColor = isFocused ? 'black' : 'white';

  const handleNavigation = () => {
    navigation.navigate('MainTabs', { screen: screen.name });
  };

  return (
    <View className="relative flex items-center">
      <Pressable
        className="p-2 flex items-center"
        onPress={handleNavigation}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <CustomIcon type={screen.iconType} name={iconName} size={26} color={iconColor} />
      </Pressable>

      {hovered && (
        <View className="absolute top-10 bg-black px-2 py-1 rounded-md">
          <Text className="text-white text-xs">{screen.label}</Text>
        </View>
      )}
    </View>
  );
};
