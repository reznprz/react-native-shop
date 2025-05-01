import { useCallback } from 'react';
import { Alert } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import { push, navigate } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';
import { logoutAll } from 'app/redux/actions';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

  // Define onPress handlers for each setting option
  const handlePress = useCallback((label: string) => {
    switch (label) {
      case 'Dashboard':
        navigate('MainTabs', {
          screen: 'Home',
        });
        break;
      case 'Food Menu':
        push(ScreenNames.FOOD);
        break;
      case 'Inventory':
        push(ScreenNames.INVENTORY);
        break;
      case 'DailySales':
        push(ScreenNames.DAILYSALES);
        break;
      case 'Past Orders':
        navigate('MainTabs', {
          screen: 'Orders',
          params: { selectedTab: 'Past Orders' },
        });
        break;
      case 'Credit Orders':
        console.log('Navigating to Credit Orders');
        break;
      case 'Expenses':
        push(ScreenNames.EXPENSE);
        break;
      case 'Sales Analytics':
        push(ScreenNames.SALESANALYTICS);
        break;
      case 'Subscription':
        console.log('Navigating to Subscription');
        break;
      case 'Edit Profile':
        console.log('Navigating to Edit Profile');
        break;
      case 'Users':
        push(ScreenNames.USER);
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

  const handleLogout = () => {
    dispatch(logoutAll());
  };

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
        {
          label: 'DailySales',
          icon: 'cash-register',
          iconType: 'MaterialCommunityIcons',
          onPress: () => handlePress('DailySales'),
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
        {
          label: 'Users',
          icon: 'star',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Users'),
        },
      ],
    },
  ];

  return { sections, handlePress, handleLogout };
};
