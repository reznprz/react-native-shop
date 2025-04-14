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
  const statusName = status?.toUpperCase() ?? '';

  if (statuType === 'OrderType') {
    const statusIcons: Record<string, IconConfig> = {
      ONLINE: {
        icon: 'https://www.enterpriseappstoday.com/wp-content/uploads/2022/07/Online-Food-Ordering-Statistics.jpg',
        iconType: 'Image',
        iconSize: 18,
      },
      STORE: { icon: 'storefront-outline', iconType: 'Restaurant', iconSize: 18 },
      TAKEOUT: {
        icon: 'food-takeout-box-outline',
        iconType: 'MaterialCommunityIcons',
        iconSize: 18,
      },
      FOODMANDU: {
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc2_qsuu5OlnoIb9L0GBrzlHdtlS0WZVO_cw&s',
        iconType: 'Image',
        iconSize: 18,
      },
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

  if (statuType == 'Payment') {
    const statusIcons: Record<string, IconConfig> = {
      CASH: {
        icon: 'money-bill-wave',
        iconType: 'FontAwesome5',
        iconSize: 20,
      },
      ESEWA: {
        icon: 'https://cdn.esewa.com.np/ui/images/logos/esewa-icon-large.png',
        iconType: 'Image',
        iconSize: 24,
      },
      FONE_PAY: {
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrhYbCtnRPJx1DlsU-AuoH7cAVnUWB5m_Sw&s',
        iconType: 'Image',
        iconSize: 24,
      },
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
    return { iconName: 'money-bill-wave', iconType: 'FontAwesome5', iconSize: 18 };
  }

  // Generic fallback icon for unknown filter types (MaterialCommunityIcons)
  return { iconName: 'restaurant', iconType: 'Ionicons', iconSize: 18 };
}
