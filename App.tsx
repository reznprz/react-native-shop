import 'react-native-gesture-handler';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import './global.css'; // Typically not needed in pure React Native projects
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { navigationRef } from './app/navigation/navigationService';
import RootNav from './app/navigation/RootNav';
import ErrorBoundary from './app/components/ErrorBoundary';
import FoodLoadingSpinner from './app/components/FoodLoadingSpinner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/redux/store';

// Initialize react-native-screens for performance
enableScreens();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', // Customize as needed
    primary: '#8b5e3c', // Primary color
    // Add other color customizations here
  },
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<FoodLoadingSpinner />} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef} theme={MyTheme}>
              <React.Suspense fallback={<FoodLoadingSpinner />}>
                <RootNav />
              </React.Suspense>
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default React.memo(App);
