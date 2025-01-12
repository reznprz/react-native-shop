import "react-native-gesture-handler";
import React from "react";
import { enableScreens } from "react-native-screens";
import "./global.css";

import StackNavigator from "./app/navigation/StackNavigator";
import { FoodProvider } from "./app/context/FoodContext";

enableScreens();

export default function App() {
  return (
    <FoodProvider>
      <StackNavigator />
    </FoodProvider>
  );
}
