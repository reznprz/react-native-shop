import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  RouteProp,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import BottomTabsNavigator from "./BottomTabsNavigator";
import LoadingScreen from "../screens/LoadingScreen"; // Import LoadingScreen
import CustomHeader from "../components/CustomHeader";
import {
  BottomTabParamList,
  bottomTabMetadata,
  RootStackParamList,
} from "./navigationTypes";

const Stack = createStackNavigator<RootStackParamList>();

const getHeaderTitle = (
  route: RouteProp<RootStackParamList, "BottomTabs">
): string => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  return (
    bottomTabMetadata[routeName as keyof BottomTabParamList]?.title ?? "App"
  );
};

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabsNavigator}
          options={({ route, navigation }) => {
            const title = getHeaderTitle(
              route as RouteProp<RootStackParamList, "BottomTabs">
            );

            const showBackButton = navigation.canGoBack();
            const { iconName } = bottomTabMetadata[
              title as keyof BottomTabParamList
            ] || {
              iconName: "ellipse-outline",
            };

            return {
              header: () => (
                <CustomHeader
                  title={title}
                  showBackButton={showBackButton}
                  onBackPress={() => navigation.goBack()}
                  iconName={iconName}
                />
              ),
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
