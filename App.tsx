import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { enableScreens } from 'react-native-screens';
import './global.css'; // Typically not needed in pure React Native projects
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { navigationRef } from './app/navigation/navigationService';
import AppContent from './app/navigation/AppContent';
import ErrorBoundary from './app/components/ErrorBoundary';
import FoodLoadingSpinner from './app/components/FoodLoadingSpinner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserInactivity from 'react-native-user-inactivity';
import { useDispatch } from 'react-redux';
import { clearAuthData } from './app/redux/authSlice';

// Initialize react-native-screens for performance
enableScreens();

const AUTO_LOGOUT_MS = 10 * 60 * 1000; // 10 minute
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});
const MyTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#ffffff', primary: '#8b5e3c' },
};

const InnerApp: React.FC = () => {
  const dispatch = useDispatch();

  const signOut = useCallback(() => {
    dispatch(clearAuthData());
    queryClient.clear();
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <UserInactivity
        timeForInactivity={AUTO_LOGOUT_MS}
        onAction={isActive => !isActive && signOut()}
        skipKeyboard
      >
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
          <React.Suspense fallback={<FoodLoadingSpinner />}>
            <AppContent />
          </React.Suspense>
        </NavigationContainer>
      </UserInactivity>
    </SafeAreaProvider>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={<FoodLoadingSpinner />} persistor={persistor}>
          <InnerApp />
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  </ErrorBoundary>
);

export default React.memo(App);
