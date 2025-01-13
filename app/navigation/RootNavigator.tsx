import React, { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StickyHeader from "../components/StickyHeader";
import SpinnerLoading from "../components/SpinnerLoading";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Suspense fallback={<SpinnerLoading />}>
      <Stack.Navigator
        screenOptions={{
          header: (props: any) => <StickyHeader {...props} />, // our custom header
        }}
      >
        {/* The main app flow is inside BottomTabNavigator */}
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
