import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import CartScreen from '../screens/CartScreen';
import CustomHeader from '../components/headers/CustomHeader';
import { ScreenDisplayNames, ScreenNames } from 'app/types/navigation';
import SpinnerLoading from 'app/components/SpinnerLoading';
import { createLazyScreen } from 'app/utils/lazyScreen';

const QrMenuItemsScreen = React.lazy(() => import('app/screens/QrMenuItemsScreen'));
const LazyOrderDetailsScreen = createLazyScreen(() => import('app/screens/OrderDetailsScreen'));

// 2) Make a small wrapper to show fallback while the chunk loads
function LazyQrMenuItemsScreen(props: any) {
  return (
    <React.Suspense fallback={<SpinnerLoading />}>
      <QrMenuItemsScreen {...props} />
    </React.Suspense>
  );
}

const Stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <Stack.Navigator>
      {/* Main Tab Navigation */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={(props) => ({
          header: () => <CustomHeader {...props} />,
        })}
      />

      <Stack.Screen
        name={ScreenNames.QR_MENU_ITEMS}
        component={LazyQrMenuItemsScreen}
        options={{
          title: ScreenDisplayNames.QR_MENU_ITEMS,
          headerShown: false,
        }}
      />

      {/* Cart Screen (Retain default header) */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'CART',
          headerShown: true, // Keep the header visible
          headerStyle: {
            backgroundColor: '#2a4759', // Set background color
          },
          headerTintColor: '#ffffff', // Change text/icon color (White)
          headerTitleStyle: {
            fontWeight: 'bold', // Make the title bold
            fontSize: 18, // Increase font size
          },
        }}
      />

      <Stack.Screen
        name={ScreenNames.ORDER_DETAILS}
        component={LazyOrderDetailsScreen}
        options={{
          title: ScreenDisplayNames.ORDER_DETAILS,
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2a4759',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
    </Stack.Navigator>
  );
}
