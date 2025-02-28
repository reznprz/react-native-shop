import { useCallback } from 'react';
import { Alert } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import { push } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';

interface SettingOption {
  label: string;
  icon: string;
  iconType: IconType;
  onPress: () => void;
}

interface Section {
  title: string;
  data: SettingOption[];
}

export const useSettingsHook = () => {
  // Define onPress handlers for each setting option
  const handlePress = useCallback((label: string) => {
    switch (label) {
      case 'Dashboard':
        console.log('Navigating to Dashboard');
        break;
      case 'Food Menu':
        push(ScreenNames.FOOD);
        break;
      case 'Inventory':
        console.log('Navigating to Inventory');
        break;
      case 'Past Orders':
        console.log('Navigating to Past Orders');
        break;
      case 'Credit Orders':
        console.log('Navigating to Credit Orders');
        break;
      case 'Expenses':
        console.log('Navigating to Expenses');
        break;
      case 'Sales Analytics':
        console.log('Navigating to Sales Analytics');
        break;
      case 'Subscription':
        console.log('Navigating to Subscription');
        break;
      case 'Edit Profile':
        console.log('Navigating to Edit Profile');
        break;
      case 'Logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: () => console.log('Logging out') },
        ]);
        break;
      default:
        console.warn('Unknown option selected');
        break;
    }
  }, []);

  // Define sections with onPress handlers
  const sections: Section[] = [
    {
      title: 'Business',
      data: [
        {
          label: 'Dashboard',
          icon: 'chart-line',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Dashboard'),
        },
        {
          label: 'Food Menu',
          icon: 'restaurant-menu',
          iconType: 'MaterialIcons',
          onPress: () => handlePress('Food Menu'),
        },
        {
          label: 'Inventory',
          icon: 'inventory',
          iconType: 'MaterialIcons',
          onPress: () => handlePress('Inventory'),
        },
      ],
    },
    {
      title: 'Orders & Payments',
      data: [
        {
          label: 'Past Orders',
          icon: 'history',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Past Orders'),
        },
        {
          label: 'Credit Orders',
          icon: 'credit-card',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Credit Orders'),
        },
        {
          label: 'Expenses',
          icon: 'file-invoice-dollar',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Expenses'),
        },
        {
          label: 'Sales Analytics',
          icon: 'chart-pie',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Sales Analytics'),
        },
      ],
    },
    {
      title: 'Account',
      data: [
        {
          label: 'Subscription',
          icon: 'star',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Subscription'),
        },
        {
          label: 'Edit Profile',
          icon: 'user-edit',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Edit Profile'),
        },
      ],
    },
  ];

  return { sections, handlePress };
};
