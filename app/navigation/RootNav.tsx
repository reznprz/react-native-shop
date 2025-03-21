import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import CustomHeader from '../components/headers/CustomHeader';
import { ScreenDisplayNames, ScreenNames } from 'app/types/navigation';
import SpinnerLoading from 'app/components/SpinnerLoading';
import { createLazyScreen } from 'app/utils/lazyScreen';

const QrMenuItemsScreen = React.lazy(() => import('app/screens/QrMenuItemsScreen'));
const LazyOrderDetailsScreen = createLazyScreen(() => import('app/screens/OrderDetailsScreen'));
const LazyFoodScreen = createLazyScreen(() => import('app/screens/FoodScreen'));
const LazyExpenseScreen = createLazyScreen(() => import('app/screens/ExpenseScreen'));
const LazyDailySalesScreen = createLazyScreen(() => import('app/screens/DailySalesScreen'));

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

      <Stack.Screen
        name={ScreenNames.ORDER_DETAILS}
        component={LazyOrderDetailsScreen}
        options={{
          title: ScreenDisplayNames.ORDER_DETAILS,
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2a4759',
          },
          headerBackTitle: 'Go Back',
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />

      <Stack.Screen
        name={ScreenNames.FOOD}
        component={LazyFoodScreen}
        options={{
          title: ScreenDisplayNames.FOOD,
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2a4759',
          },
          headerBackTitle: 'Go Back',
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />

      <Stack.Screen
        name={ScreenNames.EXPENSE}
        component={LazyExpenseScreen}
        options={{
          title: ScreenDisplayNames.EXPENSE,
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2a4759',
          },
          headerBackTitle: 'Go Back',
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />

      <Stack.Screen
        name={ScreenNames.DAILYSALES}
        component={LazyDailySalesScreen}
        options={{
          title: ScreenDisplayNames.DAILYSALES,
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2a4759',
          },
          headerBackTitle: 'Go Back',
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
