import "react-native-gesture-handler";
import React from "react";
import { enableScreens } from "react-native-screens";
import "./global.css"; // Ensure this is necessary; typically not used in pure React Native projects
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DefaultTheme,
  Theme,
} from "@react-navigation/native";
import { navigationRef } from "./app/navigation/navigationService";
import { FoodProvider } from "./app/context/FoodContext";
import RootNavigator from "./app/navigation/RootNavigator";
import ErrorBoundary from "./app/components/ErrorBoundary";
import SpinnerLoading from "./app/components/SpinnerLoading";

// Initialize react-native-screens for performance
enableScreens();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff", // Customize as needed
    primary: "#8b5e3c", // Primary color
    // Add other color customizations here
  },
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FoodProvider>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <React.Suspense fallback={<SpinnerLoading />}>
              <RootNavigator />
            </React.Suspense>
          </NavigationContainer>
        </SafeAreaProvider>
      </FoodProvider>
    </ErrorBoundary>
  );
};

export default React.memo(App);
