import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import CustomIcon from '../common/CustomIcon';

interface CenterDesktopIconsProps {
  tabScreenConfigs: Array<any>;
  navigation: any;
  activeRouteName: string;
}

export default function CenterDesktopIcons({
  tabScreenConfigs,
  navigation,
  activeRouteName,
}: CenterDesktopIconsProps) {
  return (
    <View style={styles.iconRow}>
      {tabScreenConfigs.map((screen) => (
        <IconWithTooltip
          key={screen.name}
          navigation={navigation}
          screen={screen}
          isFocused={screen.name === activeRouteName}
        />
      ))}
    </View>
  );
}

function IconWithTooltip({
  navigation,
  screen,
  isFocused,
}: {
  navigation: any;
  screen: any;
  isFocused: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Choose icon & color based on selection
  const iconName = isFocused ? screen.filledIcon : screen.icon;
  const iconColor = isFocused ? '#F5F5F5' : '#FFFFFF';
  let iconType;
  if (screen.label === 'TABLE') {
    iconType = isFocused ? screen.filledIcon : screen.icon;
  } else {
    iconType = screen.iconType;
  }

  const handleNavigation = () => {
    navigation.navigate('MainTabs', { screen: screen.name });
  };

  return (
    <View style={styles.iconWrapper}>
      <Pressable
        style={styles.pressable}
        onPress={handleNavigation}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <CustomIcon type={iconType} name={iconName} size={24} color={iconColor} />
      </Pressable>

      {hovered && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{screen.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pressable: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: -30,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 999,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 12,
  },
});
