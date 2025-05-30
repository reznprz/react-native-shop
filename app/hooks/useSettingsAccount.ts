import { useCallback } from 'react';
import { Alert } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import { push, navigate } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';
import { logoutAll } from 'app/redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/redux/store';

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

export const useSettingsAccount = () => {
  const storedAuthData = useSelector((state: RootState) => state.auth.authData);

  const dispatch = useDispatch();

  // Define onPress handlers for each setting option
  const handlePress = useCallback((label: string) => {
    switch (label) {
      case 'Dashboard':
        navigate('MainTabs', {
          screen: 'Home',
        });
        break;
      case 'Food Manager':
        push(ScreenNames.FOODMANAGER);
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
      case 'Table Manager':
        push(ScreenNames.TABLEMANAGER);
        break;
      case 'Subscription':
        push(ScreenNames.SUBSCRIPTIONPLANS);
        break;
      case 'Profile':
        push(ScreenNames.PROFILE);
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
      title: 'Settings',
      data: [
        {
          label: 'Subscription',
          icon: 'star',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Subscription'),
        },
        {
          label: 'Profile',
          icon: 'user-edit',
          iconType: 'FontAwesome5',
          onPress: () => handlePress('Edit Profile'),
        },
        {
          label: 'Users',
          icon: 'account-tie',
          iconType: 'MaterialCommunityIcons',
          onPress: () => handlePress('Users'),
        },
      ],
    },
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
          label: 'Food Manager',
          icon: 'restaurant-menu',
          iconType: 'MaterialIcons',
          onPress: () => handlePress('Food Manager'),
        },
        {
          label: 'Table Manager',
          icon: 'table',
          iconType: 'TableIcon',
          onPress: () => handlePress('Table Manager'),
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
  ];

  return { sections, restaurantInfo: storedAuthData, handlePress, handleLogout };
};
