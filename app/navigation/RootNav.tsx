import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import CartScreen from '../screens/CartScreen';
import CustomHeader from '../components/headers/CustomHeader'; // Mobile Header
import { ScreenDisplayNames, ScreenNames } from 'app/types/navigation';
import SpinnerLoading from 'app/components/SpinnerLoading';

const QrMenuItemsScreen = React.lazy(() => import('app/screens/QrMenuItemsScreen'));

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
    </Stack.Navigator>
  );
}
