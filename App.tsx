import "react-native-gesture-handler";
import React from "react";
import { enableScreens } from "react-native-screens";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { FoodProvider } from "./app/context/FoodContext";
import RootNavigator from "./app/navigation/RootNavigator";

enableScreens();

export default function App() {
  return (
    <FoodProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </FoodProvider>
  );
}
