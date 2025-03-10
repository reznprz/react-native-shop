import { IconType } from 'app/navigation/screenConfigs';

type IconConfig = {
  icon: string;
  iconType: IconType;
  iconSize: number;
};

export function getIconDetail(
  status: string,
  statuType: string = 'OrderType',
): { iconName: string; iconType: IconType; iconSize: number } {
  const statusName = status.toUpperCase();

  if (statuType === 'OrderType') {
    const statusIcons: Record<string, IconConfig> = {
      ONLINE: { icon: 'cart-outline', iconType: 'Ionicons', iconSize: 18 },
      STORE: { icon: 'storefront-outline', iconType: 'MaterialCommunityIcons', iconSize: 18 },
      TAKEOUT: {
        icon: 'food-takeout-box-outline',
        iconType: 'MaterialCommunityIcons',
        iconSize: 18,
      },
      FOODMANDU: { icon: 'hamburger', iconType: 'FontAwesome5', iconSize: 18 },
    };

    for (const key in statusIcons) {
      if (statusName.includes(key)) {
        const iconConfig = statusIcons[key];
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
