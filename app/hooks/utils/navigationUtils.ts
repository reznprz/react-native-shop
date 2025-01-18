import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { ScreenNames, Screens } from "app/types/navigation";

const getScreenDisplayName = (routeName: string): string => {
  return (
    Screens[routeName as ScreenNames]?.screenDisplayName ||
    Screens[ScreenNames.DEFAULT].screenDisplayName
  );
};

/**
 * Determines the display name based on the current route.
 * @param route - The current navigation route.
 * @returns The display name as a string.
 */
export function getRouteNameFromIndex<ParamList extends ParamListBase>(
  route: NavigationRoute<ParamList, keyof ParamList>
): string {
  if (route.name === "BottomTabs" && route.state?.type === "tab") {
    const state = route.state;

    if (
      typeof state.index === "number" &&
      Array.isArray(state.routeNames) &&
      state.index >= 0 &&
      state.index < state.routeNames.length
    ) {
      return state.routeNames[state.index];
    }
  }

  const screenDisplayName = getScreenDisplayName(route.name);

  return screenDisplayName;
}
