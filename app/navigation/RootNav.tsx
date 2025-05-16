import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import CustomHeader from '../components/headers/CustomHeader';
import { ScreenDisplayNames, ScreenNames } from 'app/types/navigation';
import { createLazyScreen } from 'app/utils/lazyScreen';

// const QrMenuItemsScreen = React.lazy(() => import('app/screens/QrMenuItemsScreen'));
const LazyOrderDetailsScreen = createLazyScreen(() => import('app/screens/OrderDetailsScreen'));
const LazyFoodMangerScreen = createLazyScreen(() => import('app/screens/FoodManagerScreen'));
const LazyExpenseScreen = createLazyScreen(() => import('app/screens/ExpenseScreen'));
const LazyDailySalesScreen = createLazyScreen(() => import('app/screens/DailySalesScreen'));
const LazyInventoryScreen = createLazyScreen(() => import('app/screens/InventoryScreen'));
const LazySalesAnalytics = createLazyScreen(() => import('app/screens/SalesAnalyticsScreen'));
const LazyUserScreen = createLazyScreen(() => import('app/screens/UserScreen'));
const LazyTableMangerScreen = createLazyScreen(() => import('app/screens/TableManagerScreen'));
const LazyProfileScreen = createLazyScreen(() => import('app/screens/ProfileScreen'));

// function LazyQrMenuItemsScreen(props: any) {
//   return (
//     <React.Suspense fallback={<SpinnerLoading />}>
//       <QrMenuItemsScreen {...props} />
//     </React.Suspense>
//   );
// }

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
        name={ScreenNames.FOODMANAGER}
        component={LazyFoodMangerScreen}
        options={{
          title: ScreenDisplayNames.FOODMANAGER,
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

      <Stack.Screen
        name={ScreenNames.INVENTORY}
        component={LazyInventoryScreen}
        options={{
          title: ScreenDisplayNames.INVENTORY,
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
        name={ScreenNames.SALESANALYTICS}
        component={LazySalesAnalytics}
        options={{
          title: ScreenDisplayNames.SALESANALYTICS,
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
        name={ScreenNames.USER}
        component={LazyUserScreen}
        options={{
          title: ScreenDisplayNames.USER,
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
        name={ScreenNames.TABLEMANAGER}
        component={LazyTableMangerScreen}
        options={{
          title: ScreenDisplayNames.TABLEMANAGER,
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
        name={ScreenNames.PROFILE}
        component={LazyProfileScreen}
        options={{
          title: ScreenDisplayNames.PROFILE,
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
