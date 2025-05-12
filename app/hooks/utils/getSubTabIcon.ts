import { IconType } from 'app/navigation/screenConfigs';

type IconConfig = {
  icon: string;
  iconType: IconType;
  iconSize: number;
};

export function getSubTabIcon(
  tabName: string,
  tabType: string = 'SubTab',
): { iconName: string; iconType: IconType; iconSize: number } {
  const tName = tabName.toLowerCase();

  if (tabType === 'SubTab') {
    const subTabsIcons: Record<string, IconConfig> = {
      all: { icon: 'list-outline', iconType: 'Ionicons', iconSize: 24 },
      'table items': { icon: 'utensils', iconType: 'TableItems', iconSize: 22 },
      'past orders': { icon: 'history', iconType: 'FontAwesome5', iconSize: 22 },
      'todays order': { icon: 'clock', iconType: 'FontAwesome5', iconSize: 22 },
      details: { icon: 'information-circle', iconType: 'Ionicons', iconSize: 22 },
      'more actions': { icon: 'ellipsis-horizontal-circle', iconType: 'Ionicons', iconSize: 22 },
      past: { icon: 'history', iconType: 'FontAwesome5', iconSize: 22 },
      register: { icon: 'Register', iconType: 'Register', iconSize: 22 },
      todays: { icon: 'clock', iconType: 'FontAwesome5', iconSize: 22 },
      tourist: { icon: 'earth-outline', iconType: 'Ionicons', iconSize: 18 },
      food: { icon: 'fast-food', iconType: 'Ionicons', iconSize: 18 },
      category: { icon: 'pricetags', iconType: 'Ionicons', iconSize: 18 },
    };

    for (const key in subTabsIcons) {
      if (tName.includes(key)) {
        const iconConfig = subTabsIcons[key];
        return {
          iconName: iconConfig.icon,
          iconType: iconConfig.iconType,
          iconSize: iconConfig.iconSize,
        };
      }
    }

    // Fallback icon for categories
    return { iconName: 'restaurant', iconType: 'Ionicons', iconSize: 18 };
  }

  // Generic fallback icon for unknown filter types (MaterialCommunityIcons)
  return { iconName: 'restaurant', iconType: 'Ionicons', iconSize: 18 };
}
